import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function ServiceOrderPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Confirmations/List/ConfirmationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'S4ServiceConfirmation');
}
