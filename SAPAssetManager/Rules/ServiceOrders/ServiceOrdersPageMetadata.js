import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function ServiceOrdersPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceOrdersListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'S4ServiceOrder');
}
