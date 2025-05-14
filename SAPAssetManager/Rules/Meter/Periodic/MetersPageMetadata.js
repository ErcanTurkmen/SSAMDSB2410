import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function MetersPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/Periodic/MetersListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'StreetRoute');
}
