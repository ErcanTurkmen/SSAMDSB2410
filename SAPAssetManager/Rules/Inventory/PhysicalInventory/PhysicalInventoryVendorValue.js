import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {{getPageProxy(): IPageProxy & {binding: PhysicalInventoryDocHeader}} & IFormCellProxy} context  */
export default function PhysicalInventoryVendorValue(context) {
    const pageProxy = context.getPageProxy();
    const supplier = !ValidationLibrary.evalIsEmpty(pageProxy.binding?.PhysicalInventoryDocItem_Nav) && pageProxy.binding.PhysicalInventoryDocItem_Nav[0].Supplier;
    return supplier || '';
}
