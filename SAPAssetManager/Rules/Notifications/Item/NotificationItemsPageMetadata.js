import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function NotificationItemsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationItem');
}
