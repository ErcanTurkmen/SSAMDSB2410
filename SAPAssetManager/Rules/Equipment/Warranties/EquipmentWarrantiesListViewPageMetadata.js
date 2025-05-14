import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function EquipmentWarrantiesListViewPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Equipment/Warranties/EquipmentWarrantiesListView.page');
    return ModifyListViewTableDescriptionField(clientAPI, page, 'MyEquipWarranty');
}
