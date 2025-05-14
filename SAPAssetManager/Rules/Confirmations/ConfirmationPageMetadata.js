import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function ConfirmationPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Confirmations/ConfirmationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'Confirmation');
}
