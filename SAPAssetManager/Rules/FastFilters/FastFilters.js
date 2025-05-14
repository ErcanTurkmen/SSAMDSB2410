import FastFiltersHelper from './FastFiltersHelper';
import Logger from '../Log/Logger';
import ODataDate from '../Common/Date/ODataDate';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import CommonLibrary from '../Common/Library/CommonLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import FilterLibrary from '../Filter/FilterLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

export const DUE_DATE_FILTER_GROUP = 'due_date';
export const EMERGENCY_FILTER_GROUP = 'emergency';

export const TIME_FILTERS = {
    'DUE_DATE_YESTERDAY': 'FILTER_DUE_DATE_YESTERDAY',
    'DUE_DATE_LAST_WEEK': 'FILTER_DUE_DATE_LAST_WEEK',
    'DUE_DATE_THIS_WEEK': 'FILTER_DUE_DATE_THIS_WEEK',
    'DUE_DATE_TODAY': 'FILTER_DUE_DATE_TODAY',
};

export const FAST_FILTERS = {
    'ASSIGNED_TO_ME': 'FILTER_ASSIGNED_TO_ME',
    'EMERGENCY': 'FILTER_EMERGENCY',
    'MODIFIED': 'FILTER_MODIFIED',
    'MY_WORK_CENTER': 'FILTER_MY_WORK_CENTER',
    'FLIGHT_ORDERS': 'FILTER_FLIGHT_ORDERS',
};

/**
 * @typedef fastFilterItem
 * @prop {string} name
 * @prop {string} value
 * @prop {string} property
 * @prop {string} group
 * @prop {boolean} visible
 */

export default class FastFilters {

    constructor(context, filterPageName = '', listPageName = '', config = {}) {
        this._instance = null;
        this.filterPageName = filterPageName;
        this.listPageName = listPageName;
        this.config = config;
        this.setAllFiltersCaption(context);
        this.resetClientData(context);
    }

    resetClientData(context) {
        let clientData = this.getClientData(context);

        //DUE_DATE_THIS_WEEK
        //DUE_DATE_TODAY
        if (!clientData.customDueDate) {
            clientData.dueDateSwitch = false;
            clientData.dueStartDate = undefined;
            clientData.dueEndDate = undefined;
        }

        //EMERGENCY
        clientData.EmergencyFiltering = false;

        //MODIFIED
        clientData.PendingFiltering = false;
    }

    setConfigProperty(propertyName, propertyValue) {
        if (this.config) {
            this.config[propertyName] = propertyValue;
        }
    }

    setAllFiltersCaption(context) {
        this.filtersNameMapping = {
            [FAST_FILTERS.ASSIGNED_TO_ME]: context.localizeText('assigned_to_me'),
            [FAST_FILTERS.EMERGENCY]: context.localizeText('emergency_work_filter'),
            [FAST_FILTERS.MODIFIED]: context.localizeText('pending_filter'),
            [FAST_FILTERS.FLIGHT_ORDERS]: context.localizeText('flight_orders'), //Defense feature
            [FAST_FILTERS.MY_WORK_CENTER]: CommonLibrary.getUserWorkCenters() || context.localizeText('my_work_center_filter'),
            [TIME_FILTERS.DUE_DATE_THIS_WEEK]: context.localizeText('due_this_week_filter'),
            [TIME_FILTERS.DUE_DATE_TODAY]: context.localizeText('map_search_wo_due_today'),
            [TIME_FILTERS.DUE_DATE_LAST_WEEK]: context.localizeText('last_week'),
            [TIME_FILTERS.DUE_DATE_YESTERDAY]: context.localizeText('day_yesterday'),
        };
    }

    setNewFilterCaption(filterFlag, newCaption) {
        if (this.filtersNameMapping) {
            this.filtersNameMapping[filterFlag] = newCaption;
        }
    }

    getFilterCaption(filterFlag) {
        return filterFlag && this.filtersNameMapping ? this.filtersNameMapping[filterFlag] : '';
    }

    // an array of required list page filters
    /** @returns {fastFilterItem[]} */
    getFastFilters() {
        Logger.info('FastFilters', 'getFastFilters is not implemented');
        return [];
    }

    // an array of required list page sorters
    // values: {caption: '', property: '', visible: true/false}
    getSorters() {
        Logger.info('FastFilters', 'getSortes is not implemented');
        return [];
    }

    // returns an array of fast filter items for the list page
    getFastFilterItemsForListPage(context) {
        let fastFilters = [];

        let fastFilterList = this.getFastFilters(context);
        fastFilterList.forEach(filter => {
            if (filter.visible) {
                fastFilters.push(FastFiltersHelper.getFilterItem(this.getFilterCaption(filter.name), filter.value, filter.property, filter.group));
            }
        });

        let sorters = this.getSorters(context);
        if (sorters.length) {
            sorters.forEach(sorter => {
                if (sorter.visible) {
                    fastFilters.push(FastFiltersHelper.getSorterItem(sorter.caption, sorter.property, context.localizeText('sort_filter_prefix')));
                }
            });
        }

        return fastFilters;
    }


    // sets values from the fast filter to the modal filter page
    setFastFilterValuesToFilterPage(context) {
        let fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);
        let clientData = this.getClientData(context);

        fastFilters.forEach(filter => {
            filter.filterItems.forEach(filterValue => {
                switch (filterValue) {
                    case this._getAssignmentFilterItemReturnValue(context): {
                        if (this.isAssignmentFilterVisible(context)) {
                            CommonLibrary.setStateVariable(context, 'SupervisorAssignmentFilter', [CommonLibrary.getPersonnelNumber() || '00000000']);
                        }
                        break;
                    }
                    case this._getEmergencyFilterItemReturnValue(): {
                        if (this.isEmergencyFilterVisible(context)) {
                            clientData.EmergencyFiltering = true;
                        }
                        break;
                    }
                    case this._getPendingFilterItemReturnValue(): {
                        if (this.isModifiedFilterVisible(context)) {
                            clientData.PendingFiltering = true;
                        }
                        break;
                    }
                    case this._getMyWorkCenterFilterItemReturnValue(): {
                        if (this.isMyWorkCenterFilterVisible(context)) {
                            this._setWorkCenterFastFilterValuesToFilterPage(context, this.config.workCenters);
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        });

        this._setTimeFilterValuesToClientData(context, fastFilters, clientData);

        let formCellContainer = context.getControl('FormCellContainer');
        formCellContainer.redraw();
    }

    // sets values from the modal filter page to the fast filter
    /** @param {FilterCriteria} workCenterFilterCriteria  */
    getFastFilterValuesFromFilterPage(context, workCenterFilterCriteria, dueDateFilterCriteria) {
        //reset all fast filters
        context.getFilter()._filterCriteria = [];
        context.getFilter()._filterResult = [];

        let filterResults = [];
        let clientData = this.getClientData(context);

        if (this.isAssignmentFilterVisible(context)) {
            let selectedAssignmnet = CommonLibrary.getStateVariable(context, 'SupervisorAssignmentFilter');
            if (selectedAssignmnet === CommonLibrary.getPersonnelNumber()) {
                filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(FAST_FILTERS.ASSIGNED_TO_ME), [this._getAssignmentFilterItemReturnValue()]));
            }
        }

        if (this.isModifiedFilterVisible(context) && clientData.PendingFiltering) {
            filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(FAST_FILTERS.MODIFIED), [this._getPendingFilterItemReturnValue()]));
            clientData.PendingFiltering = false;
        }

        if (this.isMyWorkCenterFilterVisible(context) && workCenterFilterCriteria && !ValidationLibrary.evalIsEmpty(workCenterFilterCriteria.filterItems) && !ValidationLibrary.evalIsEmpty(this.config.workCenters)) {
            const isMyWorkCentersSelected = this.config.workCenters.every(workCenter => workCenterFilterCriteria.filterItems.includes(workCenter));

            if (isMyWorkCentersSelected) {
                this.config.workCenters.forEach(workCenterId => {
                    const idx = workCenterFilterCriteria.filterItems.indexOf(workCenterId);
                    workCenterFilterCriteria.filterItems.splice(idx, 1);
                    workCenterFilterCriteria.filterItemsDisplayValue.splice(idx, 1);
                });
                filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(FAST_FILTERS.MY_WORK_CENTER), [this._getMyWorkCenterFilterItemReturnValue()]));
            }
            if (!ValidationLibrary.evalIsEmpty(workCenterFilterCriteria.filterItems)) {
                filterResults.push(workCenterFilterCriteria);
            }
        }

        return [...filterResults, ...this._getTimeFilterValuesFromClientData(context, clientData, dueDateFilterCriteria)].filter(i => !!i);
    }

    isDueDateFilterVisible() {
        Logger.info('FastFilters', 'isDueDateFilterVisible is not implemented');
        return false;
    }

    isAssignmentFilterVisible() {
        Logger.info('FastFilters', 'isAssignmentFilterVisible is not implemented');
        return false;
    }

    isEmergencyFilterVisible(context) {
        return IsPhaseModelEnabled(context) && (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isCustomPersona(context));
    }

    isModifiedFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isCustomPersona(context);
    }

    isMyWorkCenterFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isCustomPersona(context);
    }

    isSorterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isCustomPersona(context);
    }

    getClientData(context) {
        return context.evaluateTargetPath(`#Page:${this.listPageName}/#ClientData`);
    }

    _getAssignmentFilterItemReturnValue() {
        Logger.info('FastFilters', '_getAssignmentFilterItemReturnValue is not implemented');
        return '';
    }

    _getEmergencyFilterItemReturnValue() {
        return 'E';
    }

    _getPendingFilterItemReturnValue() {
        return 'sap.hasPendingChanges()';
    }

    _getMyWorkCenterFilterItemReturnValue() {
        let workCenters = this.config.workCenters;
        let returnValue = 'true';

        if (workCenters) {
            returnValue = workCenters.map(workCenter => {
                return `${this.config.workCenterPropertyPath} eq '${workCenter}'`;
            }).join(' or ');
        }

        return returnValue;
    }

    _setWorkCenterFastFilterValuesToFilterPage(context, workCenters) {
        const workCenterControl = context.evaluateTargetPath(`#Page:${this.filterPageName}/#Control:WorkCenterFilter`);
        const selectedWorkCenters = workCenterControl.getValue().map(f => f.ReturnValue) || [];
        workCenterControl.setValue(selectedWorkCenters.concat(workCenters.filter(wc => !selectedWorkCenters.includes(wc))));
    }

    _setTimeFilterValuesToClientData(context, fastFilters = [], clientData = {}) {
        if (this.isDueDateFilterVisible(context)) {
            fastFilters.forEach(filter => {
                filter.filterItems.some(filterValue => {
                    let dbDate = '';

                    switch (filterValue) {
                        case this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY): {
                            dbDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_TODAY);
                            break;
                        }
                        case this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_LAST_WEEK): {
                            dbDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_LAST_WEEK);
                            break;
                        }
                        case this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_THIS_WEEK): {
                            dbDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_THIS_WEEK);
                            break;
                        }
                        case this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_YESTERDAY): {
                            dbDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_YESTERDAY);
                            break;
                        }
                        default:
                            break;
                    }

                    if (dbDate) {
                        clientData.dueDateSwitch = true;
                        clientData.dueStartDate = dbDate.start;
                        clientData.dueEndDate = dbDate.end;
                        return true;
                    }

                    return false;
                });
            });
        }
    }

    _getTimeFilterValuesFromClientData(context, clientData = {}, dueDateFilterCriteria) {
        let timeResults = [];

        if (this.isDueDateFilterVisible(context)) {
            if (dueDateFilterCriteria) {
                let todayDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_TODAY);
                let yesterdayDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_YESTERDAY);
                let thisWeekDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_THIS_WEEK);
                let lastWeekDate = this._getFilterDates(context, TIME_FILTERS.DUE_DATE_LAST_WEEK);

                clientData.customDueDate = false;
                if (clientData.dueStartDate.includes(todayDate.start) && clientData.dueEndDate.includes(todayDate.end)) {
                    timeResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(TIME_FILTERS.DUE_DATE_TODAY), [this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY)]));
                    clientData.dueDateSwitch = false;
                } else if (clientData.dueStartDate.includes(yesterdayDate.start) && clientData.dueEndDate.includes(yesterdayDate.end)) {
                    timeResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(TIME_FILTERS.DUE_DATE_YESTERDAY), [this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_YESTERDAY)]));
                    clientData.dueDateSwitch = false;
                } else if (clientData.dueStartDate.includes(thisWeekDate.start) && clientData.dueEndDate.includes(thisWeekDate.end)) {
                    timeResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(TIME_FILTERS.DUE_DATE_THIS_WEEK), [this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_THIS_WEEK)]));
                    clientData.dueDateSwitch = false;
                } else if (clientData.dueStartDate.includes(lastWeekDate.start) && clientData.dueEndDate.includes(lastWeekDate.end)) {
                    timeResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(TIME_FILTERS.DUE_DATE_LAST_WEEK), [this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_LAST_WEEK)]));
                    clientData.dueDateSwitch = false;
                } else {
                    timeResults.push(dueDateFilterCriteria);
                    clientData.customDueDate = true;
                }
            }
        } else {
            timeResults.push(dueDateFilterCriteria);
            clientData.customDueDate = true;
        }

        return timeResults;
    }

    _getDueDateFilterItemReturnValue(context, filterFlag) {
        let dbDate = this._getFilterDates(context, filterFlag);
        return FilterLibrary.getDateFilterItemReturnValue(this.config.dueDatePropertyPath, dbDate.start, dbDate.end);
    }

    _getFilterDates(context, filterFlag = TIME_FILTERS.DUE_DATE_TODAY) {
        let firstDate = new Date();
        let lastDate = new Date(new Date().setDate(firstDate.getDate() + 1)); // from today until tomorrow (excl)

        if (filterFlag === TIME_FILTERS.DUE_DATE_THIS_WEEK) {
            let date = new Date();
            firstDate = firstDate.setDate(date.getDate() - date.getDay() + 1); // from monday
            lastDate = lastDate.setDate(date.getDate() + (7 - date.getDay() + 1));  // till next monday (excl)
        } else if (filterFlag === TIME_FILTERS.DUE_DATE_YESTERDAY) {
            firstDate = firstDate.setDate(firstDate.getDate() - 1);  // from yesterday
            lastDate = new Date();  // till today (excl)
        } else if (filterFlag === TIME_FILTERS.DUE_DATE_LAST_WEEK) {
            let date = new Date();
            firstDate = firstDate.setDate(date.getDate() - date.getDay() + 1 - 7);  // from last monday
            lastDate = lastDate.setDate(date.getDate() + (7 - date.getDay()) - 7 + 1);  // to this monday (excl.)
        }

        let odataFirstDate = new ODataDate(firstDate).toDBDateString(context);
        let odataLastDate = (filterFlag === TIME_FILTERS.DUE_DATE_TODAY) ? odataFirstDate.substring(0, 10) + 'T23:59:59' : new ODataDate(lastDate).toDBDateString(context);
        return { start: odataFirstDate, end: odataLastDate };
    }
}
