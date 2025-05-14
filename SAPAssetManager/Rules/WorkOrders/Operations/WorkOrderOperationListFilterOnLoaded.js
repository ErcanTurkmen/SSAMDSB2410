import filterOnLoaded from '../../Filter/FilterOnLoaded';
import libCom from '../../Common/Library/CommonLibrary';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function WorkOrderOperationListFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');
    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    if (IsPhaseModelEnabled(context)) {
        const filters = PhaseLibrary.getFiltersFromPage(context, 'WorkOrderOperationsListViewPage');
        PhaseLibrary.setPhaseControlFilterValue(context, 'WorkOrderOperationsFilterPage', filters);
        PhaseLibrary.setPhaseControlKeyFilterValue(context, 'WorkOrderOperationsFilterPage', filters);
    }

    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    let scheduledEarliestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateSwitch');
    let scheduledEarliestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateSwitch');
    let scheduledLatestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateSwitch');
    let scheduledLatestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateSwitch');

    if (clientData && clientData.ScheduledEarliestStartDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateEndFilter');

        scheduledEarliestStartDateSwitch.setValue(clientData.ScheduledEarliestStartDateSwitch);
        startDateControl.setValue(clientData.ScheduledEarliestStartDateStartFilter);
        endDateControl.setValue(clientData.ScheduledEarliestStartDateEndFilter);

        startDateControl.setVisible(clientData.ScheduledEarliestStartDateSwitch);
        endDateControl.setVisible(clientData.ScheduledEarliestStartDateSwitch);
    }

    if (clientData && clientData.ScheduledEarliestEndDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateEndFilter');

        scheduledEarliestEndDateSwitch.setValue(clientData.ScheduledEarliestEndDateSwitch);
        startDateControl.setValue(clientData.ScheduledEarliestEndDateStartFilter);
        endDateControl.setValue(clientData.ScheduledEarliestEndDateEndFilter);

        startDateControl.setVisible(clientData.ScheduledEarliestEndDateSwitch);
        endDateControl.setVisible(clientData.ScheduledEarliestEndDateSwitch);
    }

    if (clientData && clientData.ScheduledLatestStartDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateEndFilter');

        scheduledLatestStartDateSwitch.setValue(clientData.ScheduledLatestStartDateSwitch);
        startDateControl.setValue(clientData.ScheduledLatestStartDateStartFilter);
        endDateControl.setValue(clientData.ScheduledLatestStartDateEndFilter);

        startDateControl.setVisible(clientData.ScheduledLatestStartDateSwitch);
        endDateControl.setVisible(clientData.ScheduledLatestStartDateSwitch);
    }

    if (clientData && clientData.ScheduledLatestEndDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateEndFilter');

        scheduledLatestEndDateSwitch.setValue(clientData.ScheduledLatestEndDateSwitch);
        startDateControl.setValue(clientData.ScheduledLatestEndDateStartFilter);
        endDateControl.setValue(clientData.ScheduledLatestEndDateEndFilter);

        startDateControl.setVisible(clientData.ScheduledLatestEndDateSwitch);
        endDateControl.setVisible(clientData.ScheduledLatestEndDateSwitch);
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }

    if (clientData.OperationFastFiltersClass) {
        clientData.OperationFastFiltersClass.resetClientData(context);
        clientData.OperationFastFiltersClass.setFastFilterValuesToFilterPage(context);
    }
}

