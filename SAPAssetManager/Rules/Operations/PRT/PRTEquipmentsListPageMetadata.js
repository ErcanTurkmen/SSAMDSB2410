import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function PRTEquipmentsListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTEquipmentsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'MyWorkOrderTool');
}
