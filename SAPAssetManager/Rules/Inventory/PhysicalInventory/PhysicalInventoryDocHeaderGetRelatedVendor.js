import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import { VendorToDisplayValue } from '../IssueOrReceipt/VendorListPickerItems';

/** @param {IClientAPI & {binding: PhysicalInventoryDocHeader | PhysicalInventoryDocItem}} context */
export default function PhysicalInventoryDocHeaderGetRelatedVendor(context) {
    let supplier = '';
    if (context.binding['@odata.type'] === '#sap_mobile.PhysicalInventoryDocHeader') {
        supplier = !ValidationLibrary.evalIsEmpty(context.binding.PhysicalInventoryDocItem_Nav) && context.binding.PhysicalInventoryDocItem_Nav[0].Supplier;
    } else if (context.binding['@odata.type'] === '#sap_mobile.PhysicalInventoryDocItem') {
        supplier = context.binding.Supplier;
    }
    return supplier ? context.read('/SAPAssetManager/Services/AssetManager.service', 'Vendors', ['Vendor', 'Name1'], `$filter=Vendor eq '${supplier}'`)
        .then((/** @type {ObservableArray<Vendor>} */ vendors) => !ValidationLibrary.evalIsEmpty(vendors) && VendorToDisplayValue(vendors.getItem(0)))
        .then(displayValue => displayValue || '') : Promise.resolve('');
}
