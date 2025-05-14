import CommonLibrary from '../Common/Library/CommonLibrary';

//Introduce MyNotificationListView state variable for custom page load
//Only used to turn My Notifications quick filter
export default function MyNotificationsListViewNav(context) {
    CommonLibrary.setStateVariable(context, 'OnFollowOnNotificationsList', false);
    CommonLibrary.setStateVariable(context, 'MyNotificationListView', true);
    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationsListViewNav.action');
}
