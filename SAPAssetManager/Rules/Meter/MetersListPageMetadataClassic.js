import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function MetersListPageMetadataClassic(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/MetersListClassicView.page');
    let entityType = 'Device';
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        entityType = 'OrderISULink';
    }
	return ModifyListViewTableDescriptionField(context, page, entityType);
}
