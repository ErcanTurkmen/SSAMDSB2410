import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function IsValuationTypeVisible(context) {
    if (CommonLibrary.IsOnCreate(context) && ValidationLibrary.evalIsEmpty(context.binding?.Material)) {
        return Promise.resolve(false);
    }

    if (context.binding && context.binding.ValuationType) {
        return Promise.resolve(true);
    } else if (context.binding && context.binding.Material) {
        let filter = `$filter=MaterialNum eq '${context.binding.Material}'`;

        if (context.binding.Plant) {
            filter += ` and Plant eq '${context.binding.Plant}'`;
        }

        if (context.binding.StorageLocation) {
            filter += ` and StorageLocation eq '${context.binding.StorageLocation}'`;
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', [], filter + '&$expand=MaterialPlant').then(result => {
            if (result && result.length > 0) {
                let materialSLoc = result.getItem(0);
                return getMaterialValue(materialSLoc);
            }

            return false;
        });
    }

    return Promise.resolve(false);
}

function getMaterialValue(materialSLoc) {
    return materialSLoc.MaterialPlant ? !!materialSLoc.MaterialPlant.ValuationCategory : false;
}
