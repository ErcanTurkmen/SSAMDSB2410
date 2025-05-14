import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function EquipmentListViewPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Equipment/EquipmentListView.page');
    return ModifyListViewTableDescriptionField(clientAPI, page, 'MyEquipment');
}
