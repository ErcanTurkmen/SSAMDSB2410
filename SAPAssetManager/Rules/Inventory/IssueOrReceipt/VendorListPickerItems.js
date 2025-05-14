/**
 * @param {IListPickerFormCellProxy} context
 * @typedef {{ DisplayValue: string, ReturnValue: string }} ListPickerElement
 * @returns {Promise<ListPickerElement[]>}
*/
export default function VendorListPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Vendors', ['Vendor', 'Name1'], '$orderby=Vendor')
        .then((/** @type {ObservableArray<Vendor>} */ vendors) => [
            ...new Map(vendors.map((/** @type {Vendor} */ vendor) => [vendor.Vendor, VendorToListpickerItem(vendor)])).values(),
        ]);
}

/**
 * @param {Vendor} vendor
 * @returns {{ ReturnValue: string, DisplayValue: string }} */
export function VendorToListpickerItem(vendor) {
    return {
        'DisplayValue': VendorToDisplayValue(vendor),
        'ReturnValue': `${vendor.Vendor}`,
    };
}


/** @param {Vendor} vendor */
export function VendorToDisplayValue(vendor) {
    return `${vendor.Vendor} - ${vendor.Name1}`;
}
