import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function WorkOrderHistoriesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/WorkOrderHistoriesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'WorkOrderHistory');
}
