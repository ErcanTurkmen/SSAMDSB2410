import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryMaterialListPickerQueryOptions(context) {
 
    let plant = libCom.getStateVariable(context, 'PhysicalInventoryItemPlant');
    if (!plant) {
        plant = libCom.getDefaultUserParam('USER_PARAM.WRK');
    }
    let storageLocation = libCom.getStateVariable(context, 'PhysicalInventoryItemStorageLocation');
    if (!storageLocation) {
        storageLocation = libCom.getUserDefaultStorageLocation();
    }
    if (plant && storageLocation) {
        return `$filter=Plant eq '${plant}' and StorageLocation eq '${storageLocation}'&$expand=Material&$orderby=MaterialNum,Plant,StorageLocation`;
    } else {
        return "$filter=Plant eq '-1'&$expand=Material&$orderby=MaterialNum,Plant,StorageLocation";
    }
}
