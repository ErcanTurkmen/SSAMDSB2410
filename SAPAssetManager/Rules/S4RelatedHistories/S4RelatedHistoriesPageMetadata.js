import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function S4RelatedHistoriesPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/S4RelatedHistories/S4RelatedHistoriesPendingListView.page');

    let entityName = 'S4ServiceOrderRefObjHistory';
    const pageBinding = context.getPageProxy().binding || {};
    switch (pageBinding.RelatedEntity) {
        case 'S4ServiceRequest':
            entityName = 'S4ServiceRequestRefObjHistory';
            break;
        case 'S4ServiceConfirmation':
            entityName = 'S4ServiceConfirmationRefObjHistory';
            break;
        default:
           break;
    }

	return ModifyListViewTableDescriptionField(context, page, entityName);
}
