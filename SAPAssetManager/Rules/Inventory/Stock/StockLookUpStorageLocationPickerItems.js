
export default function StockLookUpStorageLocationPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'StorageLocations', ['StorageLocation', 'StorageLocationDesc'], '$orderby=StorageLocation')
        .then((/** @type {ObservableArray<StorageLocation>} */ slocs) => [
            ...new Map(slocs.map((/** @type {StorageLocation} */ slocation) => [slocation.StorageLocation, {
                'DisplayValue': `${slocation.StorageLocation} - ${slocation.StorageLocationDesc}`,
                'ReturnValue': `${slocation.StorageLocation}`,
            }])).values(),
        ]);
}
