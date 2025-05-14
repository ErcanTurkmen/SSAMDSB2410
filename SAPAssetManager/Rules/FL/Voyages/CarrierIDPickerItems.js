/**
* @param {IClientAPI} context
*/
export default async function CarrierIDPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyages', [], '$orderby=Supplier')
        .then((voyages) => [... new Set(Array.from(voyages, c => c.Supplier))]
        .map(uniqueSupplier => ({
            'DisplayValue': `${uniqueSupplier}`,
            'ReturnValue': `${uniqueSupplier}`,
        })));
}
