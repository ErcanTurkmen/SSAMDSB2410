import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function ChecklistListPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/Checklists/ChecklistsListView.page');
    return ModifyListViewTableDescriptionField(context, page, 'ChecklistBusObject');
}
