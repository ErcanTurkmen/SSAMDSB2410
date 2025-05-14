import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function SubOperationsListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderSubOperation');
}
