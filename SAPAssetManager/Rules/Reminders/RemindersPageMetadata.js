import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function RemindersPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Reminders/RemindersListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'UserPreference');
}
