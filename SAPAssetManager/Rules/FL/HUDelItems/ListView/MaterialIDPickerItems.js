/**
* @param {IClientAPI} context
*/
export default function MaterialIDPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHuDelItems', [], '$orderby=Material')
        .then((materials) => [... new Set(Array.from(materials, c => c.Material))]
        .map(uniqueMaterial => ({
            'DisplayValue': `${uniqueMaterial}`,
            'ReturnValue': `${uniqueMaterial}`,
        })));
}
