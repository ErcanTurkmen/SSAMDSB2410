import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function FunctionalLocationListViewPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FunctionalLocation/FunctionalLocationListView.page');
    return ModifyListViewTableDescriptionField(clientAPI, page, 'MyFunctionalLocation');
}
