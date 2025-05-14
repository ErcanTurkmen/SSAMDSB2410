import filterOnLoaded from '../Filter/FilterOnLoaded';
import libCom from '../Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import PhaseLibrary from '../PhaseModel/PhaseLibrary';
import FastFiltersHelper from '../FastFilters/FastFiltersHelper';

export default function WorkOrderFilterOnLoaded(context) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
    filterOnLoaded(context); //Run the default filter on loaded

    if (clientData.WOFastFiltersClass) {
        clientData.WOFastFiltersClass.resetClientData(context);
        clientData.WOFastFiltersClass.setFastFilterValuesToFilterPage(context);
    }

    let filter = libCom.getStateVariable(context, 'SupervisorAssignmentFilter');
    if (filter) { //Default the assigbnment filter values
        let formCellContainer = context.getControl('FormCellContainer');
        let assignControl = formCellContainer.getControl('AssignmentFilter');
        assignControl.setValue(filter);
        libCom.removeStateVariable(context, 'SupervisorAssignmentFilter');
    }

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');
    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    if (IsPhaseModelEnabled(context)) {
        const filters = PhaseLibrary.getFiltersFromPage(context, 'WorkOrdersListViewPage');
        PhaseLibrary.setPhaseControlFilterValue(context, 'WorkOrderFilterPage', filters);
        PhaseLibrary.setPhaseControlKeyFilterValue(context, 'WorkOrderFilterPage', filters);
    }

    let reqDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:RequestStartDateSwitch');
    let dueDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueDateSwitch');
    const isReqDateApplied = isDateFilterAppliedToList(context, context.localizeText('request_start_date'));
    const isDueDateApplied = isDateFilterAppliedToList(context, context.localizeText('due_date'));

    if (clientData?.reqDateSwitch !== undefined && isReqDateApplied) {
        let reqStartDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqStartDateFilter');
        let reqEndDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqEndDateFilter');

        reqDateSwitch.setValue(clientData.reqDateSwitch);
        reqStartDateControl.setValue(new Date(clientData.reqStartDate));
        reqEndDateControl.setValue(new Date(clientData.reqEndDate));

        reqStartDateControl.setVisible(clientData.reqDateSwitch);
        reqEndDateControl.setVisible(clientData.reqDateSwitch);
    }

    if (clientData?.dueDateSwitch !== undefined && isDueDateApplied) {
        let dueStartDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueStartDateFilter');
        let dueEndDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueEndDateFilter');

        dueDateSwitch.setValue(clientData.dueDateSwitch);
        dueStartDateControl.setValue(new Date(clientData.dueStartDate));
        dueEndDateControl.setValue(new Date(clientData.dueEndDate));

        dueStartDateControl.setVisible(clientData.dueDateSwitch);
        dueEndDateControl.setVisible(clientData.dueDateSwitch);
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }

    if (clientData && clientData.OrderProcessingContext) {
        let emergencySwitch = context.getControl('FormCellContainer').getControl('EmergencySwitch');
        emergencySwitch.setValue(clientData.OrderProcessingContext);
    }
}

function isDateFilterAppliedToList(context, filterLabel) {
    const appliedFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);
    return appliedFilters?.some(filter => filter.type === 1 && filter.label === filterLabel);
}
