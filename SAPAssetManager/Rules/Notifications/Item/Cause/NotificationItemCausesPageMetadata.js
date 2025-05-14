import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function NotificationItemCausesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemCausesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyNotificationItemCause');
}
