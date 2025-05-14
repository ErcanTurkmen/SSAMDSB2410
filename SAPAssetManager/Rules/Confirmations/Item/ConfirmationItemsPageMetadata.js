import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function ConfirmationItemsPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/Confirmations/Item/ConfirmationsItemsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'S4ServiceConfirmationItem');
}
