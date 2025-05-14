import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function ServiceQuotationsPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceQuotations/ServiceQuotationsListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'S4ServiceQuotation');
}
