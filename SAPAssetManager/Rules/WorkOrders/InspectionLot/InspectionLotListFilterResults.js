import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function InspectionLotListFilterResults(context) {
    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');
    let filterResults = GetInspectionLotListFilterCriteria(context, true);

    if (clientData.ChecklistFastFiltersClass) {
        filterResults = filterResults.concat(clientData.ChecklistFastFiltersClass.getFastFilterValuesFromFilterPage(context));
    }
    
    return filterResults;
}

export  function GetInspectionLotListFilterCriteria(context, saveToClientData = false) {
    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');
    let result1 = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:ValuationStatusFilter/#Value');
    let filterResults = [result1, result2];
    let pageProxy = context.getPageProxy();

    let woListPickerProxy = libCom.getControlProxy(pageProxy, 'WorkOrderFilter');
    let woSelection = woListPickerProxy.getValue()[0] ? woListPickerProxy.getValue()[0].ReturnValue : '';
    if (!libEval.evalIsEmpty(woSelection)) {
        let woFilter = ["OrderId eq '" + woSelection + "'"];
        let woFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, woFilter, true);
        filterResults.push(woFilterResult);
    }

    let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
    let opSelection = opListPickerProxy.getValue()[0] ? opListPickerProxy.getValue()[0].ReturnValue : '';
    if (!libEval.evalIsEmpty(opSelection)) {
        let opFilter = ["OperationNo eq '" + opSelection + "'"];
        let opFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, opFilter, true);
        filterResults.push(opFilterResult);
    }

    let dueDateSwitch = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueDateSwitch');
    if (dueDateSwitch.getValue() === true) {
        let startDate = libCom.getFieldValue(context, 'DueStartDateFilter');
        let sdate = (libCom.isDefined(startDate)) ? startDate : new Date();
        sdate.setHours(0, 0, 0, 0);

        let currentDate = new Date().toISOString().substring(0, 10);
        let filterStartDate = sdate.toISOString().substring(0, 10);
        let odataStartDate = new Date();
        let odataBackendStartDate = new Date();
        if (filterStartDate === currentDate) {
            odataStartDate = new OffsetODataDate(sdate);
            odataBackendStartDate = odataStartDate.toDBDateString(context);
        }
        else {
            odataStartDate = new ODataDate(sdate);
            odataBackendStartDate = odataStartDate.toLocalDateString();
        }

        let endDate = libCom.getFieldValue(context, 'DueEndDateFilter');
        let edate = (libCom.isDefined(endDate)) ? endDate : new Date();
        edate.setHours(0, 0, 0, 0);

        let filterEndDate = edate.toISOString().substring(0, 10);
        let odataEndDate = new Date();
        let odataBackendEndDate = new Date();
        if (filterEndDate === currentDate) {
            odataEndDate = new OffsetODataDate(edate);
            odataBackendEndDate = odataEndDate.toDBDateString(context);
        }
        else {
            odataEndDate = new ODataDate(edate);
            odataBackendEndDate = odataEndDate.toLocalDateString();
        }
        odataBackendEndDate = odataBackendEndDate.substring(0, 10) + "T23:59:59";

        let dateFilter = ["InspectionLot_Nav/EndDate ge datetime'" + odataBackendStartDate + "' and InspectionLot_Nav/EndDate le datetime'" + odataBackendEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, context.localizeText('due_date'), [`${context.formatDate(sdate)} - ${context.formatDate(edate)}`]);
        filterResults.push(dateFilterResult);

        if (saveToClientData) {
            clientData.dueDateSwitch = dueDateSwitch.getValue();
            clientData.dueStartDate = sdate;
            clientData.dueEndDate = edate;
        }
    }
    
    return filterResults;
}
