import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function PRTDocumentListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTDocumentsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderTool');
}
