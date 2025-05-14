export default function GetEquipmentLocationInformation(context) {
    const binding = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Equipment', [], '$expand=EquipGeometries/Geometry').then(function(equipResult) {
        if (equipResult) {
            const item = equipResult.getItem(0);
            if (item && item.EquipGeometries && item.EquipGeometries.length > 0 && item.EquipGeometries[0].Geometry) {
                return item;
            }
        }
        return undefined;
    });
}
