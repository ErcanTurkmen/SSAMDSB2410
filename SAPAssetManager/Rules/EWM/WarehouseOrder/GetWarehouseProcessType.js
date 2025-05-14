/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libVal from '../../Common/Library/ValidationLibrary';
export default function GetWarehouseProcessType(context) { 
    const activityArea = context.binding.ActivityArea;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseProcessTypes', [], `$filter=WarehouseNo eq '${context.binding.WarehouseNo}' and WarehouseProcessType eq '${context.binding.WOProcessType}'`).then(function(result) {
        if (!libVal.evalIsEmpty(result)) {
            return [activityArea, result.getItem(0).WarehouseProcessTypeDescription].filter(i => !!i).join(', ');
        }
        return activityArea;
    }); 
}
