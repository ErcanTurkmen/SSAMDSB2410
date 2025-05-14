import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

export default function ServiceQuotationItemsPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceQuotations/ServiceQuotationItemsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'S4ServiceQuotationItem');
}
