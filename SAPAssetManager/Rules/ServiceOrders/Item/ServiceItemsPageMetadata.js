import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function ServiceItemsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceItemsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'S4ServiceItem');
}
