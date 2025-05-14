import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libPersona from '../Persona/PersonaLibrary';
import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
import libThis from './FilterSettings';

/**
 * @typedef FilterFeedbackItem
 * @prop {string} customQueryGroup
 * @prop {string} displayValue
 * @prop {string} filterProperty
 * @prop {FilterType} filterType
 * @prop {boolean} isActive
 * @prop {boolean} isFastFilter
 * @prop {string} label
 * @prop {string} returnValue
 */

export default class {

    /**
     * Gets Preference Group value from static global
     * @param {IClientAPI} context
     */
    static getPreferenceGroup(context) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/Filter/PreferenceGroup.global').getValue();
    }

    /**
     * Gets Preference Name value based on current persona and list page name
     * @param {IClientAPI} context
     */
    static getPreferenceName(context) {
        const sectionedTable = context.getPageProxy().getFilter();
        const pageName = libCom.getPageName(sectionedTable ? sectionedTable.controlProxy.getPageProxy() : context.getPageProxy());
        return libThis.getPreferenceNameFromPageName(context, pageName);
    }

    /**
     * Gets Preference Name value based on current persona and list page name
     * @param {IClientAPI} context
     */
    static getPreferenceNameFromPageName(context, pageName) {
        return `${libPersona.getActivePersona(context)}-${pageName}`;
    }

    /**
     * Reads saved filter settings from 'UserPreferences' table for current persona and list page
     * @param {IClientAPI} context
     */
    static async readFilterSettings(context) {
        return libThis.readFilterSettingsByPreferenceName(context, libThis.getPreferenceName(context));
    }

    /**
     * Reads saved filter settings from 'UserPreferences' table for current persona and list page
     * @param {IClientAPI} context
     */
    static async readFilterSettingsByPreferenceName(context, preferenceName) {
        try {
            const readResult = await context.read('/SAPAssetManager/Services/AssetManager.service',
                'UserPreferences',
                [],
                `$filter=PreferenceGroup eq '${libThis.getPreferenceGroup(context)}' and PreferenceName eq '${preferenceName}'`);
            return readResult.getItem(0);
        } catch (err) {
            Logger.error('readFilterSettings', err);
            return null;
        }
    }

    /**
     * Parses FilterCriteria objects array into JSON string and saves it into 'UserPreferences' table for current persona and list page
     * @param {IClientAPI} context
     * @param {FilterCriteria[]} filterCriteria
     */
    static async onSettingsSave(context, filterCriteria) {
        if (!libCom.isDefined(filterCriteria)) {
            return;
        }

        const pageProxy = context.getPageProxy();
        const clientData = pageProxy.getClientData();
        const preferenceName = libThis.getPreferenceName(context);

        try {
            pageProxy.showActivityIndicator();

            clientData.PreferenceName = preferenceName;
            clientData.PreferenceValue = JSON.stringify(filterCriteria);

            const settingsRecord = await libThis.readFilterSettingsByPreferenceName(context, preferenceName);
            let saveAction;

            if (!libCom.isDefined(settingsRecord)) {
                saveAction = '/SAPAssetManager/Actions/Filter/FilterSettingsCreate.action';
            } else {
                clientData.ReadLink = settingsRecord['@odata.readLink'];
                saveAction = '/SAPAssetManager/Actions/Filter/FilterSettingsUpdate.action';
            }

            await pageProxy.executeAction(saveAction);
        } catch (err) {
            Logger.error('onSettingsSave', err);
            pageProxy.executeAction({
                'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
                'Properties': {
                    'Message': pageProxy.localizeText('update_failed'),
                },
            });
        } finally {
            pageProxy.dismissActivityIndicator();
        }
    }

    /**
     * Parses JSON string into array of FilterCriteria objects
     * @param {IClientAPI} context
     * @param {string} string
     */
    static parseFilterCriteriaString(context, string) {
        try {
            // MDK function has an issue that parsed criteria don't have display values, so creating FilterCriteria object manually for now
            // const savedCriteria = savedFilter && context.convertJSONStringToFilterCriteriaArray(savedFilter.PreferenceValue);
            return JSON.parse(string)
                .map(c => context.createFilterCriteria(c._type, c._name, c._caption, c._filterItems, c._isArrayFilterProperty, c._label, c._filterItemsDisplayValue))
                .filter(c => !!c);
        } catch (err) {
            Logger.error('parseFilterCriteriaString', err);
            return [];
        }
    }

    /**
     * Combines existing filter criteria from sectionedTable with filter criteria saved in 'UserPreferences' table for current page
     * by removing duplicating filters and combining filter items for the same property
     * @param {IClientAPI} context
     * @param {FilterCriteria[]} existingFilters
     * @param {FilterCriteria[]} newFilters
     */
    static combineFilters(context, existingFilters = [], newFilters = []) {
        let result = [];
        for (let filterItem of newFilters) {
            if (filterItem.name && filterItem.name.includes('/MobileStatus')) { // mobile status filter
                let existingComplexFilter = existingFilters.find(f => f.filterItems[0] && f.filterItems[0].includes('/MobileStatus'));
                if (existingComplexFilter) {
                    libThis.excludeRepeatedStatuses(filterItem, existingComplexFilter);
                    if (filterItem.filterItems.length) {
                        result.push(filterItem);
                    }
                } else {
                    libThis.combineSimpleFiltersOrSorters(context, filterItem, existingFilters, result);
                }
            } else if (!filterItem.isArrayFilterProperty && (filterItem.type === context.filterTypeEnum.Sorter || filterItem.name)) { // sorter and simple filters
                libThis.combineSimpleFiltersOrSorters(context, filterItem, existingFilters, result);
            } else if (filterItem.isArrayFilterProperty) { // complex filters
                let existingFilterIdx = existingFilters.findIndex(f => f.filterItems[0] === filterItem.filterItems[0]);
                // exclude found item from existing filters array
                if (existingFilterIdx !== -1) {
                    existingFilters.splice(existingFilterIdx, 1);
                }
                result.push(filterItem);
            }
        }
        // push the rest of existing filters that did not match or overlap with any of new filters into result array
        result.push(...existingFilters);

        return result;
    }

    /**
     * Combines sorters or simple filters with the same name
     * @param {IClientAPI} context
     * @param {FilterCriteria} filterItem
     * @param {FilterCriteria[]} existingFilters
     * @param {FilterCriteria[]} result
     */
    static combineSimpleFiltersOrSorters(context, filterItem, existingFilters, result) {
        let existingFilterIdx = existingFilters.findIndex(f => f.type === filterItem.type && (filterItem.name ? f.name === filterItem.name : true));
        if (existingFilterIdx !== -1) {
            // exclude found item from existing filters array
            let existingFilter = existingFilters.splice(existingFilterIdx, 1)[0];
            result.push(libThis.createCombinedFilterCriterion(context, existingFilter, filterItem));
        } else {
            result.push(filterItem);
        }
    }

    /**
     * Takes in new simple filter by status and existing complex filter which contains filter string with multiple statuses and
     * excludes statuses that are already included in complex filter string from simple filter
     * @param {FilterCriteria} newFilter
     * @param {FilterCriteria} existingFilter
     */
    static excludeRepeatedStatuses(newFilter, existingFilter) {
        let { filterItems, filterItemsDisplayValue } = newFilter;
        // get array of values from query string
        const existingFilterValues = existingFilter.filterItems[0].match(/\'\w+\'/g).map(str => str.replace(/'/g, ''));
        for (let value of existingFilterValues) {
            if (filterItems.includes(value)) {
                let idx = filterItems.indexOf(value);
                filterItems.splice(idx, 1);
                filterItemsDisplayValue.splice(idx, 1);
            }
        }
    }

    /**
     * Checks if any of saved filters partially or fully match one of fast filters existing for current list page.
     * If there's a match, then replaces matching part with fast filter, so that we don't have duplicating filters
     * @param {IClientAPI} context
     * @param {FilterCriteria[]} newFilters
     * @param {FilterFeedbackItem[]} fastFilters
     */
    static checkForMatchingFastFiltersAndUpdate(context, newFilters, fastFilters) {
        for (let filterIdx in newFilters) {
            let filter = newFilters[filterIdx];
            if (filter.name) {
                // check if filter properties in saved filter name and fast filter query string match
                let matchingFastFilters = fastFilters.filter(f => f.filterType === filter.type && f.returnValue.includes(filter.name) && (f.returnValue.includes('/MobileStatus') ? !f.returnValue.includes('ne') : true));
                libThis.replaceWithMatchingFastFilterIfExists(context, filter, matchingFastFilters, newFilters);
            } else {
                // check for complete match of saved complex filter/sorter and fast filters
                let matchingFastFilter = fastFilters.find(f => f.filterType === filter.type && f.returnValue === filter.filterItems[0]);
                if (matchingFastFilter) {
                    newFilters.push(context.createFilterCriteria(matchingFastFilter.filterType, undefined, undefined, [matchingFastFilter.returnValue],
                        matchingFastFilter.filterType === context.filterTypeEnum.Filter, matchingFastFilter.label, [matchingFastFilter.displayValue]));
                    newFilters.splice(+filterIdx, 1);
                }
            }
        }
    }

    /**
     * Loops through given fast filters and, if saved filter includes all values from fast filter,
     * pushes that fast filter into result array and excludes matching values from saved filter
     * @param {IClientAPI} context
     * @param {FilterCriteria} filter
     * @param {FilterFeedbackItem[]} fastFilters
     * @param {FilterCriteria[]} result
     */
    static replaceWithMatchingFastFilterIfExists(context, filter, fastFilters, result) {
        for (let fastFilter of fastFilters) {
            // get array of values from query string
            const fastFilterValues = fastFilter.returnValue.match(/\'\w+\'/g).map(str => str.replace(/'/g, ''));
            if (fastFilterValues.every(el => filter.filterItems.includes(el))) {
                result.push(context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [fastFilter.returnValue], true, undefined, [fastFilter.displayValue]));
                for (let value of fastFilterValues) {
                    let idx = filter.filterItems.indexOf(value);
                    filter.filterItems.splice(idx, 1);
                    filter.filterItemsDisplayValue.splice(idx, 1);
                }
            }
        }
    }

    /**
     * Combines filter items from new and exsiting filter for the same property
     * @param {IClientAPI} context
     * @param {FilterCriteria} newFilter
     * @param {FilterCriteria} existingFilter
     */
    static createCombinedFilterCriterion(context, existingItem, newItem) {
        let filterItems = [... new Set([...existingItem.filterItems, ...newItem.filterItems])];
        let filterItemsDisplayValue = [... new Set([...existingItem.filterItemsDisplayValue, ...newItem.filterItemsDisplayValue])];
        return context.createFilterCriteria(newItem.type, newItem.name, newItem.caption, filterItems, newItem.isArrayFilterProperty,
            newItem.type === context.filterTypeEnum.Sorter ? context.localizeText('sort_filter_prefix') : newItem.label, filterItemsDisplayValue);
    }

    /**
     * Applies filter criteria saved in 'UserPreferences' table for current page to sectionedTable filters, if there are any
     * @param {IClientAPI} context
     */
    static async applySavedFilterOnList(context) {
        if (!PersonalizationPreferences.getPersistFilterPreference(context)) {
            return;
        }
        setTimeout(async () => {
            try {
                let sectionedTable = libCom.getSectionedTableProxy(context);
                const savedFilter = await libThis.readFilterSettings(context);
                let parsedFilterCriteria = savedFilter && libThis.parseFilterCriteriaString(context, savedFilter.PreferenceValue) || [];
                parsedFilterCriteria = parsedFilterCriteria.filter(c => libCom.isDefined(c.filterItems));
                if (sectionedTable && libCom.isDefined(parsedFilterCriteria)) {
                    let combined = libThis.combineFilters(context, sectionedTable.filters, parsedFilterCriteria);
                    libThis.checkForMatchingFastFiltersAndUpdate(context, combined, sectionedTable._control._filterFeedbackItems);
                    sectionedTable.filters = combined;
                    context._page._redrawActionBar(); // redraw action bar to update count on 'Filter' button
                }
            } catch (err) {
                Logger.error('applySavedFilterOnList', err);
            }
        }, 500);
    }

    /**
     * Saves filters set for page by us during navigation to use later during filter reset
     * @param {IClientAPI} context
     */
    static saveInitialFilterForPage(context, filters) {
        const sectionedTable = libCom.getSectionedTableProxy(context);
        const initialFilters = filters || sectionedTable.filters;
        if (libCom.isDefined(initialFilters)) {
            const pageName = libCom.getPageName(context);
            libCom.setStateVariable(context, `InitialFilters-${pageName}`, initialFilters);
        }
    }

    /**
     * @param {IPageProxy} filterPageProxy
     * @param {IClientAPI} context
     */
    static async resetFilters(context, filterPageProxy, listPageProxy) {
        try {
            const preferenceName = libThis.getPreferenceName(context);
            const savedFilter = await libThis.readFilterSettingsByPreferenceName(filterPageProxy, preferenceName);
            await libThis.removeSavedFilters(filterPageProxy, savedFilter);

            await context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');

            libThis.restoreDefaultFilters(listPageProxy);
        } catch (err) {
            Logger.error('resetFilters', err);
            await context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    }

    static async removeSavedFilters(pageProxy, savedFilter) {
        const clientData = pageProxy.getClientData();
        // delete saved filters in UserPreferences table, if they exist
        if (libCom.isDefined(savedFilter)) {
            clientData.ReadLink = savedFilter['@odata.readLink'];
            await pageProxy.executeAction('/SAPAssetManager/Actions/Filter/FilterSettingsDelete.action');
        }
    }

    static restoreDefaultFilters(listPageProxy) {
        // get initial filters for page and apply them, if they exist
        const listPageName = libCom.getPageName(listPageProxy);
        const initialFilters = libCom.getStateVariable(listPageProxy, `InitialFilters-${listPageName}`);

        if (libCom.isDefined(initialFilters)) {
            const sectionedTable = libCom.getSectionedTableProxy(listPageProxy);
            sectionedTable.filters = initialFilters;
        }
        listPageProxy._page._redrawActionBar();
    }
}
