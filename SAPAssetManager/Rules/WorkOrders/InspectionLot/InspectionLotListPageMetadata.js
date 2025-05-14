import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function InspectionLotListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/InspectionLot/InspectionLotListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'EAMChecklistLink');
}
