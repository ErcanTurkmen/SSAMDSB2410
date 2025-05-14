import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function DocumentsPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Documents/DocumentsBDSListView.page');
	return ModifyListViewTableDescriptionField(context, page, 'Document');
}
