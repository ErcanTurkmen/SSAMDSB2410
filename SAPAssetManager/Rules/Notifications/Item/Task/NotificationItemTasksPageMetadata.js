import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function NotificationItemTasksPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemTasksListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationItemTask');
}
