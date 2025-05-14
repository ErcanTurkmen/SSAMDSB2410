export default function NotificationsFilterOnLoaded(context) {
    let clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    if (clientData) {
        setDateRangeToClient(context, clientData, 'CreationDate', 'CreationDateEnd', 'CreatedDateSwitch');
        setDateRangeToClient(context, clientData, 'RequiredStartDate', 'RequiredEndDate', 'DueDateSwitch');
        setDateRangeToClient(context, clientData, 'MalfunctionStartDate', 'MalfunctionEndDate', 'MalfunctionDateSwitch');
    }
}

function setDateRangeToClient(context, clientData, startDateFilterName, endDateFilterName, switchControlName) {
    const startDateFilterControl = context.evaluateTargetPath(`#Page:OnlineSearchCriteriaNotifications/#Control:${startDateFilterName}`);
    const endDateFilterControl = context.evaluateTargetPath(`#Page:OnlineSearchCriteriaNotifications/#Control:${endDateFilterName}`);
    const switchControl = context.evaluateTargetPath(`#Page:OnlineSearchCriteriaNotifications/#Control:${switchControlName}`);
    if (clientData[switchControlName] !== undefined) {
        switchControl.setValue(clientData[switchControlName]);
        startDateFilterControl.setValue(clientData[startDateFilterName]);
        endDateFilterControl.setValue(clientData[endDateFilterName]);
        startDateFilterControl.setVisible(clientData[switchControlName]);
        endDateFilterControl.setVisible(clientData[switchControlName]);
    }
}
