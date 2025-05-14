import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function MaterialListPickerEntitySet(context) {
    return getMaterialListPickerConfig(context.binding || undefined).entitySet;
}

export function getMaterialListPickerConfig(binding = {}) {
    let config = {
        'entitySet': 'Materials',
        'queryOptions': '$expand=MaterialPlants,MaterialSLocs&$orderby=MaterialNum',
    };

    let plant = binding.Plant || CommonLibrary.getUserDefaultPlant();
    let storageLocation = binding.StorageLocation || CommonLibrary.getUserDefaultStorageLocation();

    let isPlantHasValue = !!plant;
    let isStorageLocationHasValue = !!storageLocation;

    if (isPlantHasValue && isStorageLocationHasValue) {
        config.entitySet = 'MaterialSLocs';
        config.queryOptions = `$expand=Material,MaterialPlant&$orderby=MaterialNum&$filter=Plant eq '${plant}' and StorageLocation eq '${storageLocation}'`;
    } else if (isPlantHasValue) {
        config.entitySet = 'MaterialPlants';
        config.queryOptions = `$orderby=MaterialNum&$expand=Material,MaterialSLocs&$filter=Plant eq '${plant}'`;
    }

    return config;
}
