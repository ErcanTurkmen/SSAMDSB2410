import libVal from '../Common/Library/ValidationLibrary';
/***
 * Get Movement type data
 * @param {IClientAPI} context 
 * 
*/
export default function GetMovementTypeData(context,movementType) {

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MovementTypes', [], `$filter=MovementType eq '${movementType}'`).then(function(results) {
        if (!libVal.evalIsEmpty(results)) {
            return results.getItem(0);
        }
        return '';
    });
}
