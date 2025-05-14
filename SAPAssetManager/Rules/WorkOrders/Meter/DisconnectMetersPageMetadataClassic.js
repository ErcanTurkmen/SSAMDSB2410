import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function DisconnectMetersPageMetadataClassic(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/MetersListClassicViewWithActivity.page');
	return ModifyListViewTableDescriptionField(context, page, 'DisconnectionObject');
}
