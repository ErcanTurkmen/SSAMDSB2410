import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function PRTPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderTool');
}
