/**
* @param {IClientAPI} context
*/
export default async function VoyageNumberPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyages', [], '$orderby=VoyageNumber')
        .then((voyages) => [... new Set(Array.from(voyages, c => c.VoyageNumber))]
        .map(uniqueVoyage => ({
            'DisplayValue': `${uniqueVoyage}`,
            'ReturnValue': `${uniqueVoyage}`,
        })));
}
