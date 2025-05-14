import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function NotificationsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationHeader');
}
