import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function WorkOrderRelatedHistoriesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/WorkOrderRelatedHistoriesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'WorkOrderHistory');
}
