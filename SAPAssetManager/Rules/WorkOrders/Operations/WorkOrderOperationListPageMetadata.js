import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function WorkOrderOperationListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderOperation');
}
