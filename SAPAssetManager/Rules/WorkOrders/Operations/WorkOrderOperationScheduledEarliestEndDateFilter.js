import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function WorkOrderOperationScheduledEarliestEndDateFilter(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateStartFilter');
    let endControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateEndFilter');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    clientData.ScheduledEarliestEndDateSwitch = dateSwitch.getValue();

    RedrawFilterToolbar(context);
}

