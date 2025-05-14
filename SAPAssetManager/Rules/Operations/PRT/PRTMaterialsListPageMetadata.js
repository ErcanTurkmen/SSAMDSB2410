import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function PRTMaterialsListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTMaterialsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderTool');
}
