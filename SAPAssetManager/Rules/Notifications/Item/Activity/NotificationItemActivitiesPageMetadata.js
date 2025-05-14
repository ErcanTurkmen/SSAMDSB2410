import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function NotificationItemActivitiesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemActivitiesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationItemActivity');
}
