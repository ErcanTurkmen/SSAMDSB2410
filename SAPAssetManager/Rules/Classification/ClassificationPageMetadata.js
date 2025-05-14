import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function ClassificationPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/Classification/ClassificationListView.page');
    return ModifyListViewTableDescriptionField(context, page, 'ClassDefinition');
}
