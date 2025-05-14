import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function CreatedDateFilterSwitchOnChange(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:CreatedDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:CreationDate');
    let endControl = context.evaluateTargetPath('#Page:OnlineSearchCriteriaNotifications/#Control:CreationDateEnd');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    clientData.CreatedDateSwitch = dateSwitch.getValue();
    RedrawFilterToolbar(context);
}
