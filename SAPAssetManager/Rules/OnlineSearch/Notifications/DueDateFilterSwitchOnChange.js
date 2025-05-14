import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function DueDateFilterSwitchOnChange(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:DueDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:RequiredStartDate');
    let endControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:RequiredEndDate');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    clientData.DueDateSwitch = dateSwitch.getValue();

    RedrawFilterToolbar(context);
}
