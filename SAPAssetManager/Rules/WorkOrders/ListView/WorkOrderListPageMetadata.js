import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function WorkOrderListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/WorkOrdersListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderHeader');
}
