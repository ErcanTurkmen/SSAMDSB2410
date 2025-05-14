import libCom from '../Common/Library/CommonLibrary';
import libFilter from '../Filter/FilterLibrary';
import Logger from '../Log/Logger';
import libPersona from '../Persona/PersonaLibrary';
import libThis from './OnlineSearchLibrary';
import GetPropertyNameForEntity from './SearchCriteria/GetPropertyNameForEntity';
import ODataLibrary from '../OData/ODataLibrary';

export default class {
    /**
    * @param {IClientAPI} context 
    * @param {Promise<boolean[]>} valPromises 
    */
    static searchCriteriaValidation(context, valPromises) {
        // if all resolved -> return true
        // if at least 1 rejected -> return false
        return Promise.allSettled(valPromises).then(results => {
            const pass = results.every(r => r.status === 'fulfilled');
            if (!pass) {
                throw new Error();
            }
            return true;
        }).catch (() => {
            let container = context.getControl('FormCellContainer');
            container.redraw();
            return false;
        });
    }

    /**
    * @param {IClientAPI} context
    * @param {string} pageName 
    */
    static simplePropertySearchCriteriaValidation(context) {
        const simplePropertyControls = libThis.getSimplePropertyControls(context);
        let valPromises = [];
        simplePropertyControls.forEach(control => {
            const name = control.getName();
            const filterProperty = GetPropertyNameForEntity(context, 'FilterProperty', name) || name;
            const limit = context.getGlobalDefinition(`/SAPAssetManager/Globals/MaxLength/${filterProperty}MaxLength.global`).getValue();
            valPromises.push(libThis.charLimitValidation(context, control, limit));
        });

        return libThis.searchCriteriaValidation(context, valPromises);
    }

    /**
    * @param {IClientAPI} context 
    * @param {IControlProxy} control
    * @param {number} limit 
    */
    static charLimitValidation(context, control, limit) {
        control.clearValidation();
        const valueLength = control.getValue() && control.getValue().length;

        if (!valueLength || valueLength <= limit) {
            return Promise.resolve(true);
        } else {
            const dynamicParams = [valueLength, limit];
            const message = context.localizeText('exceeds_max_length_x_x', dynamicParams);
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }
    }
 
    /**
    * @param {IClientAPI} context
    * @param {string} pageName 
    */
    static saveSearchCriteriaToClientData(context, pageName) {
        const simplePropertyControls = libThis.getSimplePropertyControls(context);
        simplePropertyControls.forEach(control => {
            if (libCom.isDefined(control.getValue())) {
                context.evaluateTargetPathForAPI(`#Page:${pageName}`).getClientData()[control.getName()] = control.getValue();
            } else {
                context.evaluateTargetPathForAPI(`#Page:${pageName}`).getClientData()[control.getName()] = '';
            }
        });
        return Promise.resolve();
    }

    /**
    * @param {IControlProxy} control
    * @param {string} pageName
    */
    static getFilterDefaultValue(control, pageName) {
        return control.evaluateTargetPathForAPI(`#Page:${pageName}`).getClientData()[control.getName()];
    }
    
    /**
    * @param {IClientAPI} context
    */
    static getSimplePropertyControls(context) {
        let dictionary = libCom.getControlDictionaryFromPage(context);
        return Object.values(dictionary)
            .filter(c => c._control.type === 'Control.Type.FormCell.SimpleProperty');
    }
    
    /**
     * checks if offline data cache has online entity's ID
     * @param {IClientAPI} context
     * @param {string} entitySet
     * @param {string} key
     */
    static isOnlineEntityAvailableOffline(context, entitySet, key) {
        try {
            const clientData = context.evaluateTargetPathForAPI('#Page:OnlineSearch').getClientData();
            let binding = context.binding;
            if (!binding?.['@odata.readLink']) {
                binding = context.getActionBinding();
            }
            return Object.prototype.hasOwnProperty.call(clientData[entitySet], binding[key]);
        } catch (err) {
            Logger.error('isOnlineEntityAvailableOffline', err);
            return false;
        }
    }
    
    /**
     * Retrieve a value from a cached dictionary
     * @param {IClientAPI} context
     * @param {string} entitySet
     * @param {string} key
     * @param {string} returnProperty
     */
    static getCachedValue(context, entitySet, key, returnProperty) {
        try {
            const clientData = context.evaluateTargetPathForAPI('#Page:OnlineSearch').getClientData();
            return clientData?.[entitySet]?.[key]?.[returnProperty];
        } catch (err) {
            Logger.error('getCachedValue', err);
            return '';
        }
    }

    /**
     * @param {IClientAPI} context
     * @param {string} entitySet
     * @param {string} queryOption
     * @param {string} tab
     * @param {string} caption
     */
    static setTabCaptionWithCountAndEnableSelect(context, entitySet, queryOption, tab, caption) {
        return context.count('/SAPAssetManager/Services/OnlineAssetManager.service', entitySet, queryOption).then(count => {
            let onlinePageProxy = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
            let tabControl = onlinePageProxy.getControls()[0];
            // multi-select mode is disabled for 2410 release
            // onlinePageProxy.setActionBarItemVisible('Select', count > 0);
            return tabControl.setItemCaption(tab, context.localizeText(`${caption}_x`, [count]));
        });
    }

    /**
     * @param {IClientAPI} context
     * @param {boolean} isSelectAllButton
     */
    static selectDeselectButtonVisible(context, isSelectAllButton = true) {
        const isInSelectionMode = libThis.isCurrentListInSelectionMode(context);
        if (isInSelectionMode) {
            const selectedItems = libCom.getStateVariable(context, 'selectedItems');
            if (isSelectAllButton) {
                return (selectedItems && selectedItems.length) <= 0;
            } else {
                return (selectedItems && selectedItems.length) > 0;
            }
        }
        return false;
    }
    
    /**
     * @param {IClientAPI} context
     */
    static getCurrentTabName(context) {
        try {
            return context.evaluateTargetPathForAPI('#Page:OnlineSearch').getControl('TabsControl').getSelectedTabItemName();
        } catch (err) {
            Logger.error('getCurrentTabName', err);
            return '';
        }
    }

    /**
     * @param {IClientAPI} context
     */
    static getCurrentTabPage(context, tab = '') {
        try {
            const selectedTab = tab || libThis.getCurrentTabName(context);
            return context.evaluateTargetPathForAPI(`#Page:${libThis.getPageNameByTabName(context, selectedTab)}`);
        } catch (err) {
            Logger.error('getCurrentTabPage', err);
            return null;
        }
    }

    /**
     * @param {IClientAPI} context
     * @param {string} tab
     */
    static getPageNameByTabName(context, tab) {
        switch (tab) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue():
                return 'OnlineSearchEquipmentList';
            case context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue():
                return 'OnlineSearchFuncLocList';
            case context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue():
                return 'OnlineSearchWorkOrdersList';
            case context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue():
                return 'OnlineSearchNotificationsList';
            default:
                return '';
        }
    }
    
    /**
     * @param {IClientAPI} context
     * @param {string} tab
     */
    static getTabCaptionByTabName(context, tab) {
        const tabCaptions = {
            [context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue()]: context.localizeText('equipments'),
            [context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue()]: context.localizeText('functional_location'),
            [context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue()]: (
                libPersona.isFieldServiceTechnician(context) ?
                    context.localizeText('fow_dl_service_orders') :
                    context.localizeText('workorders')
            ),
            [context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue()]: context.localizeText('notifications'),
        };
        return tabCaptions[tab] || '';
    }

    /**
     * @param {IClientAPI} context
     */
    static isCurrentListInSelectionMode(context) {
        try {
            return libThis.getCurrentTabPage(context).getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple';
        } catch (err) {
            Logger.error('isCurrentListInSelectionMode', err);
            return false;
        }
    }
    
    /**
     * @param {ISelectableSectionProxy} table
     */
    static getTargetParameters(table) {
        try {
            const entitySet = table.getTargetSpecifier().getEntitySet();
            return {
                service: table.getTargetSpecifier().getService(),
                entitySet,
                queryOptions: '',
            };
        } catch (err) {
            Logger.error('getReadAllParameters', err);
            return null;
        }
    }
    
    /**
     * @param {IClientAPI} context
     */
    static triggerOnlineSearch(context) {
        const listPageProxy = libThis.getCurrentTabPage(context);
        const onlineSection = listPageProxy.getControls()[0].getSections()[0];
        const emptySearchSection = listPageProxy.getControls()[0].getSections()[1];

        context.showActivityIndicator(context.localizeText('loading'));
        return libThis.searchDone(context, libThis.getCurrentTabName(context))
            .then(count => libThis.executeSearchOrHideSection(context, onlineSection, emptySearchSection, count))
            .catch(err => {
                Logger.error('Online Search', `Online OData error: ${err}`);
                onlineSection.setVisible(false);
                return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/SearchFailedErrorBanner.action');
            })
            .finally(() => context.dismissActivityIndicator());
    }

    /**
     * @param {IClientAPI} context
     * @param {string} tab
     */
    static searchDone(context, tab) {
        let count = 0;
        try {
            const fieldsToExcludeFromCounting = [];
            if (libCom.getPageName(context) === 'OnlineSearchCriteriaWorkOrders') {
                const assignedToSegments = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:AssignFilterButtons');
                if (assignedToSegments) {
                    const assignedToValues = libCom.getControlValue(assignedToSegments) || [];   
                    //this segment shows Assigned To filter so segment itself should be excluded from counting
                    if (assignedToValues.length && assignedToValues[0] === 'assigned') {
                        fieldsToExcludeFromCounting.push('AssignFilterButtons');
                    }
                }
            }
            count = libFilter.getFilterCount(context, fieldsToExcludeFromCounting);
            const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
            const previousPageName = libCom.getPageName(previousPage);
            const existingCount = libCom.getStateVariable(context, 'CriteriaCount', previousPageName);
            libCom.setStateVariable(context, 'CriteriaCount', {
                ...(existingCount || {}),
                [tab]: count,
            }, previousPageName);
            if (count > 0) {
                previousPage.getPressedItem().getActionItem().text = context.localizeText('search_criteria_online_search_x', [count]);
            } else {
                previousPage.getPressedItem().getActionItem().text = context.localizeText('search_criteria_online_search');
            }
        } catch (err) {
            Logger.error('searchDone', err);
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return count;
        });
    }

    /**
     * @param {IClientAPI} context
     * @param {ISelectableSectionProxy} onlineSection
     * @param {number} criteriaCount
     */
    static executeSearchOrHideSection(context, onlineSection, emptySearchSection, criteriaCount) {
        if (libCom.isDefined(criteriaCount) && criteriaCount > 0) {
            return ODataLibrary.initializeOnlineService(context)
                .then(() => {
                    if (onlineSection.getVisible()) {
                        return onlineSection.redraw()
                            .catch((err) => Logger.error('section redraw error', err));
                    }
                    return emptySearchSection.setVisible(false)
                        .then(() => onlineSection.setVisible(true))
                        .catch((err) => Logger.error('section redraw error', err));
                });
        }

        const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
        const tabControl = onlineSearchPage.getControl('TabsControl');
        const currentTab = libThis.getCurrentTabName(context);
        tabControl.setItemCaption(currentTab, libThis.getTabCaptionByTabName(context, currentTab));
        onlineSearchPage._page._redrawActionBar();
        emptySearchSection.setVisible(true);
        return onlineSection.setVisible(false, false);
    }

    /**
     * @param {IClientAPI} context list page proxy of the tab user is currently on
     * @param {ISelectableSectionProxy} table ObjectTable control of list page user is currently on
     * @param {boolean} convertToSelectedItem whether to convert results to be a collection of SelectedItem objects to mimic what the getSelectedItems() API does
     */
    static async readAllRecords(context, table, convertToSelectedItem = true) {
        let selectedItems = [];
        const { service, entitySet, queryOptions} = libThis.getTargetParameters(table);
    
        if (service && entitySet) {
            let query = decodeURIComponent(libCom.getQueryOptionFromFilter(context));
            query += queryOptions ? `&${queryOptions}` : '';
            if (query) {
                const totalRecords = await context.count(service, entitySet, query);
                const batchSize = 50;
                let recordsAlreadyRead = selectedItems.length;
        
                while (recordsAlreadyRead < totalRecords) {
                    const recordsToRead = Math.min(batchSize, totalRecords - recordsAlreadyRead); //Read max 50 at a time instead of all at once for performance reasons
                    const recordsReadByBatch = await context.read(service, entitySet, [], `${query}&$skip=${recordsAlreadyRead}&$top=${recordsToRead}`);
        
                    for (let i = 0; i < recordsReadByBatch.length; i++) {
                        let currentRecord = recordsReadByBatch.getItem(i);
                        if (convertToSelectedItem) {
                            selectedItems.push({
                                binding: currentRecord,
                            });
                        } else {
                            selectedItems.push(currentRecord);
                        }
                    }
        
                    recordsAlreadyRead += recordsReadByBatch.length;
                    if (recordsReadByBatch.length < batchSize) { // All rows are read
                        return selectedItems;
                    }
                }
            }
        }
    
        return selectedItems;
    }
}
