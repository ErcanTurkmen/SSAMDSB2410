import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export default function DefaultDescriptionValue(context) {
    const { Material, Plant, StorageLocation } = context.binding || {};
    if (CommonLibrary.IsOnCreate(context) && ![Material, Plant, StorageLocation].every(i => !!i)) {
        return Promise.resolve('');
    }

    const readLink = `MaterialSLocs(MaterialNum='${Material}',Plant='${Plant}',StorageLocation='${StorageLocation}')`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$expand=Material,MaterialPlant/MaterialValuation_Nav')
        .then(materialSLoc => !ValidationLibrary.evalIsEmpty(materialSLoc) && materialSLoc.getItem(0).Material?.Description || '');
}
