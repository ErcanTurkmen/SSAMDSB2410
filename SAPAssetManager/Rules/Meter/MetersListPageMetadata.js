import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function MetersListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/MetersListView.page');
    let entityType = 'Device';
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        entityType = 'OrderISULink';
    }
	return ModifyListViewTableDescriptionField(context, page, entityType);
}
