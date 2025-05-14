import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function FollowOnNotificationsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/FollowOnNotificationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationHeader');
}
