import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocumentStorageLocationQueryOptions() {
    let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
    let storageLocation = CommonLibrary.getUserDefaultStorageLocation();

    if (plant && storageLocation) {
        return `$filter=Plant eq '${plant}' and StorageLocation eq '${storageLocation}'&$orderby=StorageLocation`;
    } else if (plant) {
        return `$filter=Plant eq '${plant}'&$orderby=StorageLocation`;
    }
    return '$orderby=StorageLocation';
}
