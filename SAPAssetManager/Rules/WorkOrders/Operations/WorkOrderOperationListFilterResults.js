import libCommon from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import phaseFilterResult from '../../PhaseModel/PhaseModelFilterPickerResult';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';

export default function WorkOrderOperationListFilterResults(context) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    let filterResults = GetWorkOrderOperationListFilterCriteria(context, true);
    const mobileStatusFilter = filterResults.find(c => c.name === 'OperationMobileStatus_Nav/MobileStatus');

    if (clientData.OperationFastFiltersClass) {
        filterResults = filterResults.concat(clientData.OperationFastFiltersClass.getFastFilterValuesFromFilterPage(context, mobileStatusFilter.filterItems));
    }

    libCommon.removeStateVariable(context, 'OPERATIONS_DATE_FILTER');

    return filterResults.filter(c => !!c);
}

export function GetWorkOrderOperationListFilterCriteria(context, saveToClientData = false) {
    let filterResults = [
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:SortFilter/#Value'),
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MobileStatusFilter/#Value'),
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MyOperationsFilter/#Value'),
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:AssignmentFilter/#FilterValue'),
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:TypeFilter/#FilterValue'),
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MainWorkCenterFilter/#FilterValue'),
    ];

    if (IsPhaseModelEnabled(context)) {
        let execuationStage = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ExecuationStageFilter/#Value');
        filterResults.push(execuationStage);
        let phase = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:PhaseFilter/#Value');
        let result = phaseFilterResult(context, 'PhaseFilter', phase);
        if (result) filterResults.push(result);

        PhaseLibrary.addPhaseControlFilterResult(context, 'WorkOrderOperationsFilterPage', filterResults);
        PhaseLibrary.addPhaseControlKeyFilterResult(context, 'WorkOrderOperationsFilterPage', filterResults);
    }

    const scheduledEarliestStartDate = GetDateFilter(context, 'ScheduledEarliestStartDateSwitch', 'ScheduledEarliestStartDateStartFilter',
        'ScheduledEarliestStartDateEndFilter', 'SchedEarliestStartDate', context.localizeText('scheduled_earliest_start_date'),
        saveToClientData);

    const scheduledEarliestEndDate = GetDateFilter(context, 'ScheduledEarliestEndDateSwitch', 'ScheduledEarliestEndDateStartFilter',
        'ScheduledEarliestEndDateEndFilter', 'SchedEarliestEndDate', context.localizeText('scheduled_earliest_end_date'),
        saveToClientData);

    const scheduledLatestStartDate = GetDateFilter(context, 'ScheduledLatestStartDateSwitch', 'ScheduledLatestStartDateStartFilter',
        'ScheduledLatestStartDateEndFilter', 'SchedLatestStartDate', context.localizeText('scheduled_latest_start_date'),
        saveToClientData);

    const scheduledLatestEndDate = GetDateFilter(context, 'ScheduledLatestEndDateSwitch', 'ScheduledLatestEndDateStartFilter',
        'ScheduledLatestEndDateEndFilter', 'SchedLatestEndDate', context.localizeText('scheduled_latest_end_date'),
        saveToClientData);

    filterResults = filterResults.concat([scheduledEarliestStartDate, scheduledEarliestEndDate, scheduledLatestStartDate, scheduledLatestEndDate]);

    return filterResults.filter(c => !!c);
}

function GetDateFilter(context, switchCtrlName, startCtrlName, endCtrlName, filterProp, fastFilterLabel, saveToClientData) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    let dateSwitch = context.evaluateTargetPath(`#Page:WorkOrderOperationsFilterPage/#Control:${switchCtrlName}`);

    if (dateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, startCtrlName);

        let sdate = (libCommon.isDefined(startDate)) ? startDate : new Date();
        sdate.setHours(0, 0, 0, 0);
        let odataStartDate = new ODataDate(sdate);
        let odataBackendStartDate = odataStartDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, endCtrlName);
        let edate = (libCommon.isDefined(endDate)) ? endDate : new Date();
        edate.setHours(0, 0, 0, 0);
        let odataEndDate = new ODataDate(edate);
        let odataBackendEndDate = odataEndDate.toDBDateString(context);
        odataBackendEndDate = odataBackendEndDate.substring(0, 10) + 'T23:59:59';

        let dateFilter = [`${filterProp} ge datetime'${odataBackendStartDate}' and ${filterProp} le datetime'${odataBackendEndDate}'`];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, fastFilterLabel, [`${context.formatDatetime(sdate)} - ${context.formatDatetime(edate)}`]);

        if (saveToClientData) {
            clientData[switchCtrlName] = dateSwitch.getValue();
            clientData[startCtrlName] = sdate;
            clientData[endCtrlName] = edate;
        }

        return dateFilterResult;
    }

    return null;
}
