import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/**
 * Get value for storage bin for PurchaseRequisition
 *
 * @param {IClientAPI} context
 * @returns the value for storage bin or empty string
 */
export default function PurchaseRequisitionStorageBin(context) {
    const { Material, Plant, StorageLocation } = context.binding || {};

    if (CommonLibrary.IsOnCreate(context) && ![Material, Plant, StorageLocation].every(i => !!i)) {
        return Promise.resolve('');
    }

    const queryOptions = `$expand=Material,MaterialSLocs&$filter=MaterialNum eq '${Material}' and Plant eq '${Plant}' and MaterialSLocs/any(msloc: msloc/StorageLocation eq '${StorageLocation}')`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], queryOptions)
        .then(mPlants => !ValidationLibrary.evalIsEmpty(mPlants) && mPlants.getItem(0).MaterialSLocs.find(k => k.StorageLocation === StorageLocation)?.StorageBin || '');
}
