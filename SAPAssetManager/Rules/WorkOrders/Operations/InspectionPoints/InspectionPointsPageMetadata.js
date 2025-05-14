import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function InspectionPointsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/InspectionPoints/InspectionPointsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'InspectionPoint');
}
