import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {{getPageProxy(): IPageProxy & {binding: PhysicalInventoryDocHeader}} & IFormCellProxy} context  */
export default function PhysicalInventoryWBSValue(context) {
    const pageProxy = context.getPageProxy();
    const wbsElement = !ValidationLibrary.evalIsEmpty(pageProxy.binding?.PhysicalInventoryDocItem_Nav) && pageProxy.binding.PhysicalInventoryDocItem_Nav[0].WBSElement;
    return wbsElement || '';
}
