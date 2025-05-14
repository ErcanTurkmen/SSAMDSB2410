import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function IsBatchVisible(context) {
    if (CommonLibrary.IsOnCreate(context) && ValidationLibrary.evalIsEmpty(context.binding?.Material)) {
        return Promise.resolve(false);
    }

    if (context.binding && context.binding.Batch) {
        return Promise.resolve(true);
    } else if (context.binding && context.binding.Material) {
        let filter = `$filter=MaterialNum eq '${context.binding.Material}'`;

        if (context.binding.Plant) {
            filter += ` and Plant eq '${context.binding.Plant}'`;
        }

        if (context.binding.StorageLocation) {
            filter += ` and StorageLocation eq '${context.binding.StorageLocation}'`;
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', [], filter).then(result => {
            if (result && result.length > 0) {
                let materialSLoc = result.getItem(0);
                return materialSLoc.BatchIndicator === 'X';
            }

            return false;
        });
    }

    return Promise.resolve(false);
}
