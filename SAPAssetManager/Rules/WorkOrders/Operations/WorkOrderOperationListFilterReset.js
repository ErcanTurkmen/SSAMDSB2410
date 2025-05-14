
import FilterReset from '../../Filter/FilterReset';
import phaseFilterReset from '../../PhaseModel/PhaseModelFilterPickerReset';

export default function WorkOrderOperationListFilterReset(context) {
    phaseFilterReset(context, 'PhaseFilter');

    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');

    if (clientData && clientData.ScheduledEarliestStartDateSwitch !== undefined) {
        clientData.ScheduledEarliestStartDateSwitch = undefined;
        clientData.ScheduledEarliestStartDateStartFilter = '';
        clientData.ScheduledEarliestStartDateEndFilter = '';
    }

    if (clientData && clientData.ScheduledEarliestEndDateSwitch !== undefined) {
        clientData.ScheduledEarliestEndDateSwitch = undefined;
        clientData.ScheduledEarliestEndDateStartFilter = '';
        clientData.ScheduledEarliestEndDateEndFilter = '';
    }

    if (clientData && clientData.ScheduledLatestStartDateSwitch !== undefined) {
        clientData.ScheduledLatestStartDateSwitch = undefined;
        clientData.ScheduledLatestStartDateStartFilter = '';
        clientData.ScheduledLatestStartDateEndFilter = '';
    }

    if (clientData && clientData.ScheduledLatestEndDateSwitch !== undefined) {
        clientData.ScheduledLatestEndDateSwitch = undefined;
        clientData.ScheduledLatestEndDateStartFilter = '';
        clientData.ScheduledLatestEndDateEndFilter = '';
    }

    FilterReset(context);
}

