import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function PRTMiscellaneousListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTMiscellaneousListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderTool');
}
