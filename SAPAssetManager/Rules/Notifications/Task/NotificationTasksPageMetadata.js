import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function NotificationTasksPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationTasksListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationTask');
}
