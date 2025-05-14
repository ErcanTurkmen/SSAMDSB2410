import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function VehiclesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Crew/Vehicle/VehiclesListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'CrewListItem');
}
