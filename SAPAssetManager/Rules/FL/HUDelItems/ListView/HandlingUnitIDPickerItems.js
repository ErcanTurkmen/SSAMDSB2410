/**
* @param {IClientAPI} context
*/
export default function HandlingUnitIDPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHuDelItems', [], '$orderby=HandlingUnitID')
        .then((handlingunits) => [... new Set(Array.from(handlingunits, c => c.HandlingUnitID))]
        .map(uniqueHandlingUnit => ({
            'DisplayValue': `${uniqueHandlingUnit}`,
            'ReturnValue': `${uniqueHandlingUnit}`,
        })));
}
