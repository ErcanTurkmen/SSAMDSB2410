export default function OnlinePlantValue(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${context.binding.Plant}')`, [], '$select=PlantDescription').then(function(result) {
        let returnVal = context.binding.StorageLocationDesc + " - " +context.binding.StorageLocation + " - " + result.getItem(0).PlantDescription ;
        let returnVal2 =  '$(L,available_qty_x_x)' +context.binding.UnrestrictedQuantity + " - " + context.binding.Material.BaseUOM;
        //return `${context.binding.StorageLocationDesc} - ${context.binding.StorageLocation} - ${result.getItem(0).PlantDescription}- ${context.binding.MaterialDesc}`;
        return returnVal2 + " || " + returnVal;
    }).catch(function() {
        return `${context.binding.StorageLocationDesc} - ${context.binding.Plant}`;
    });
}
