import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function NotificationActivitiesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationActivitiesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationActivity');
}
