import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function BPNotesListViewPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/Notes/BPNotesListView.page');
    return ModifyListViewTableDescriptionField(context, page, 'S4BusinessPartnerLongTexts');
}
