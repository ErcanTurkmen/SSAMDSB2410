import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function NotesListViewPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/Notes/NotesListView.page');
    let extendedEntityTypeName;

    let bindEntityType = context.binding?.['@odata.type'] || '';
    if (bindEntityType.includes('ServiceOrder')) {
        extendedEntityTypeName = 'S4ServiceOrder';
    } else if (bindEntityType.includes('ServiceRequest')) {
        extendedEntityTypeName = 'S4ServiceRequest';
    } else if (bindEntityType.includes('ServiceConfirmation')) {
        extendedEntityTypeName = 'S4ServiceConfirmation';
    } else if (bindEntityType.includes('ServiceQuotation')) {
        extendedEntityTypeName = 'S4ServiceQuotation';
    }

    return ModifyListViewTableDescriptionField(context, page, extendedEntityTypeName);
}
