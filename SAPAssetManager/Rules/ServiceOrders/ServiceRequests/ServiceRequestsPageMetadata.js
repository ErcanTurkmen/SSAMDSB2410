import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function ServiceRequestsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceRequests/ServiceRequestsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'S4ServiceRequest');
}
