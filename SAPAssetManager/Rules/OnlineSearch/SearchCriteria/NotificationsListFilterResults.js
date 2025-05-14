import libVal from '../../Common/Library/ValidationLibrary';
import libSearch from '../OnlineSearchLibrary';
import GetPropertyNameForEntity from './GetPropertyNameForEntity';
import libCommon from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function NotificationsListFilterResults(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const sortFilter = fcContainer.getControl('SortFilter').getValue();
    const priorityFilter = getPriorityFilterValue(context, fcContainer);
    const createdDateFilterRange = getDateRangeFilter('CreationDate', 'CreationDateEnd', 'CreatedDateSwitch', 'created_date_range', context);
    const startDateFilterRange = getDateRangeFilter('RequiredStartDate', 'RequiredEndDate', 'DueDateSwitch', 'due_date_range', context);
    const malfunctionDateFilterRange = getDateRangeFilter('MalfunctionStartDate', 'MalfunctionEndDate', 'MalfunctionDateSwitch', 'malfunction_date_range', context);
    
    const filter = [
        sortFilter,
        priorityFilter, 
        createdDateFilterRange, 
        startDateFilterRange, 
        malfunctionDateFilterRange, 
        ...getSimplePropertyFilters(context, fcContainer),
    ].filter(c => !!c);
    return filter;
}

function getPriorityFilterValue(context, fcContainer) {
    const priorityFilterSegmented = fcContainer.getControl('PriorityFilter');
    const priorityFilterList = fcContainer.getControl('PriorityListFilter');
    const isSegmentsVisible = priorityFilterSegmented.getVisible();
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    let value;
    if (isSegmentsVisible) {
        value = priorityFilterSegmented.getValue();
    } else {
        value = priorityFilterList.getFilterValue();
    }
    clientData.PriorityListFilter = value;
    return value;
}

function getSimplePropertyFilters(context, fcContainer) {
    const listPickerFilters = [
        'TypeFilter',
        'HeaderFunctionLocation',
        'HeaderEquipment',
        'CreatedBy',
        'ReportedBy',
        'PlanningPlantLstPkr',
        'LocationLstPkr',
        'WorkCenterFilter',
        'SystemStatus',
    ].map(n => fcContainer.getControl(n).getFilterValue());
    const notificationSystemStatusFilter = fcContainer.getControl('SystemStatus').getFilterValue();
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    if (notificationSystemStatusFilter.filterItems?.length) {
        clientData.NotificationSystemStatusFilter = {
            'filterItems': notificationSystemStatusFilter.filterItems,
            'filterItemsDisplayValue': notificationSystemStatusFilter.filterItemsDisplayValue,
        };
    } else {
        delete clientData.NotificationSystemStatusFilter;
    }
    const simplePropertyFilters = libSearch.getSimplePropertyControls(context).map(control => {
        const value = control.getValue();
        const name = control.getName();
        const filterProperty = GetPropertyNameForEntity(context, 'FilterProperty', name) || name;
        if (!libVal.evalIsEmpty(value)) {
            if (['NotificationDescription'].includes(filterProperty)) {
                return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [`substringof('${value}', ${filterProperty})`], true);
            }
            return context.createFilterCriteria(context.filterTypeEnum.Filter, filterProperty, control.getCaption(), [value], false);
        }
        return null;
    });

    return [...listPickerFilters, ...simplePropertyFilters];
}

function getDateRangeFilter(filterNameStart, filterNameEnd, switchName, label, context) {
    let dateSwitch = context.evaluateTargetPath(`#Page:OnlineSearchCriteriaNotifications/#Control:${switchName}`);
    if (dateSwitch.getValue() === true) {
        let clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
        let startDate = libCommon.getFieldValue(context, filterNameStart);
        let sdate = (libCommon.isDefined(startDate)) ? startDate : new Date();
        sdate.setHours(0,0,0,0);

        let endDate = libCommon.getFieldValue(context, filterNameEnd);
        let edate = (libCommon.isDefined(endDate)) ? endDate : new Date();
        edate.setHours(0,0,0,0);

        let dateFilter = [filterNameStart + " ge datetime'" + getBackendStartDate(context, sdate) + "' and " + filterNameEnd + " le datetime'" + getBackendEndDate(context, edate) + "'" ]; 

        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, context.localizeText(label), [`${context.formatDatetime(sdate)} - ${context.formatDatetime(edate)}`]);
        
        // saving new values of date pickers in clientData and on onLoaded action applying to appropriate picker control
        clientData[switchName] = dateSwitch.getValue();
        clientData[filterNameStart] = sdate;
        clientData[filterNameEnd] = edate;

        return dateFilterResult;
    }
    return null;
}

function getBackendStartDate(context, sdate) {
    let odataStartDate = new ODataDate(sdate);
    return odataStartDate.toDBDateString(context);
}

function getBackendEndDate(context, edate) {
    let odataEndDate = new ODataDate(edate);
    let odataBackendEndDate =  odataEndDate.toDBDateString(context);
    return odataBackendEndDate.substring(0,10) + 'T23:59:59';
}
