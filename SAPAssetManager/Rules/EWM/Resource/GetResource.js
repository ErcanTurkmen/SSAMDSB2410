import libEval from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetResource(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseResources', [], '').then((results) => {
        if (!libEval.evalIsEmpty(results)) {
            return results.getItem(0).Resource;
        }
        return '';
    });
}
