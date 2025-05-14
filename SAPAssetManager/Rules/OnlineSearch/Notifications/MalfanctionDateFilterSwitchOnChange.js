import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function MalfanctionDateFilterSwitchOnChange(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:MalfunctionDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:MalfunctionStartDate');
    let endControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:MalfunctionEndDate');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    clientData.MalfunctionDateSwitch = dateSwitch.getValue();

    RedrawFilterToolbar(context);
}
