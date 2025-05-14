export default function StockLookUpManufacturerPartNumPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], '')
        .then((/** @type {ObservableArray<Material>} */ materials) => [... new Set(Array.from(materials, m => m.ManufacturerPartNum))]
        .map(uniqueMPN => ({
            'DisplayValue': `${uniqueMPN}`,
            'ReturnValue': `${uniqueMPN}`,
        })));
}
