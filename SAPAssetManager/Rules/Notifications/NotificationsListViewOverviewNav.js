import CommonLibrary from '../Common/Library/CommonLibrary';

export default function NotificationsListVieOverviewwNav(context) {
    CommonLibrary.setStateVariable(context, 'OnFollowOnNotificationsList', false);
    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationsListViewNav.action');
}
