import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import libSearch from '../../../../SAPAssetManager/Rules/OnlineSearch/OnlineSearchLibrary';
import GetPropertyNameForEntity from '../../../../SAPAssetManager/Rules/OnlineSearch/SearchCriteria/GetPropertyNameForEntity';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';

export default function WorkOrdersListFilterResults(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, statusFilter, assignFilterButtons] = ['SortFilter', 'StatusFilter', 'AssignFilterButtons'].map(n => fcContainer.getControl(n).getValue());
    const filters = [sortFilter, statusFilter, getDateRangeFilter(context), getAssignFilter(context, assignFilterButtons, fcContainer), ...getSimplePropertyFilters(context, fcContainer, assignFilterButtons)].filter(c => !!c);
    return filters;
}

function getSimplePropertyFilters(context, fcContainer) {
    const listPickerFilters = [
        'TypeFilter',
        'HeaderFunctionLocation',
        'HeaderEquipment',
        'PlanningPlantLstPkr',
        'LocationLstPkr',
        'WorkCenterFilter',
    ].map(n => {
         //DSB customisation to post FL - train as substring so it reaches to backend and returns data as MG5601*. The key change is to use substring
        const value = fcContainer.getControl(n).getFilterValue()?.filterItems?.[0];
        const name = fcContainer.getControl(n).getName();
        if (name === 'HeaderFunctionLocation' && value) {
            const filterProperty = 'HeaderFunctionLocation';
            let funcloFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [`substringof('${value}', ${filterProperty})`], true);
            Logger.info(funcloFilter);
            return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [`substringof('${value}', ${filterProperty})`], true);
        }
        else {
            return fcContainer.getControl(n).getFilterValue()
        }
    });
    //fcContainer.getControl(n).getFilterValue());
    const simplePropertyFilters = libSearch.getSimplePropertyControls(context).map(control => {
        const value = control.getValue();
        const name = control.getName();
        const filterProperty = GetPropertyNameForEntity(context, 'FilterProperty', name) || name;
        if (!libVal.evalIsEmpty(value)) {
            if (['OrderDescription'].includes(filterProperty)) {
                return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [`substringof('${value}', ${filterProperty})`], true);
            }
            return context.createFilterCriteria(context.filterTypeEnum.Filter, filterProperty, control.getCaption(), [value], false);
        }
        return null;
    });

    return [...listPickerFilters, ...simplePropertyFilters];
}

function getDateRangeFilter(context) {
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchWorkOrdersList/#ClientData');
    let dateSwitch = context.evaluateTargetPath('#Page:OnlineSearchCriteriaWorkOrders/#Control:StartDateSwitch');
    if (dateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, 'StartDateFilter');
        let sdate = (libCommon.isDefined(startDate)) ? startDate : new Date();
        sdate.setHours(0, 0, 0, 0);
        let odataStartDate = new ODataDate(sdate);
        let odataBackendStartDate = odataStartDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, 'EndDateFilter');
        let edate = (libCommon.isDefined(endDate)) ? endDate : new Date();
        edate.setHours(0, 0, 0, 0);
        let odataEndDate = new ODataDate(edate);
        let odataBackendEndDate = odataEndDate.toDBDateString(context);
        odataBackendEndDate = odataBackendEndDate.substring(0, 10) + 'T23:59:59';

        let dateFilter = ["ScheduledStartDate ge datetime'" + odataBackendStartDate + "' and ScheduledEndDate le datetime'" + odataBackendEndDate + "'"];

        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, context.localizeText('start_date_range'), [`${context.formatDatetime(sdate)} - ${context.formatDatetime(edate)}`]);

        clientData.StartDateSwitch = dateSwitch.getValue();
        clientData.StartDateFilter = sdate;
        clientData.EndDateFilter = edate;

        return dateFilterResult;
    } else {
        clientData.StartDateSwitch = undefined;
    }
    return null;
}

function getAssignFilter(context, assignFilterButtons, fcContainer) {
    const assignPicker = fcContainer.getControl('AssignedToPicker').getFilterValue();
    const assignedToItems = assignFilterButtons?.filterItems || [];
    const isAssignedSelected = assignedToItems.length ? assignedToItems[0] === 'assigned' : false;
    const isUnassignedSelected = assignedToItems.length ? assignedToItems[0] === 'unassigned' : false;
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchWorkOrdersList/#ClientData');
    clientData.AssignFilterButtons = assignFilterButtons;

    if (isAssignedSelected) {
        return assignPicker;
    } else if (isUnassignedSelected) {
        return context.createFilterCriteria(context.filterTypeEnum.Filter, 'AssignedTo', context.localizeText('assignedto'), ['00000000'], false);
    }
    return null;
}
