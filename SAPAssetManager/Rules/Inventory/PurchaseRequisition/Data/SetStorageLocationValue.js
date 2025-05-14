import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SetStorageLocationValue(context) {
    let data = context.binding;

    if (data && data.Plant && data.StorageLocation) {
        return `StorageLocations(StorageLocation='${data.StorageLocation}',Plant='${data.Plant}')`;
    }

    let defaultPlant = CommonLibrary.getUserDefaultPlant();
    let defaultStorageLocation = CommonLibrary.getUserDefaultStorageLocation();
    if (defaultStorageLocation && defaultPlant) {
        return `StorageLocations(StorageLocation='${defaultStorageLocation}',Plant='${defaultPlant}')`;
    }

    return '';
}
