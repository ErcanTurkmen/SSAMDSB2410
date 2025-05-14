import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {IClientAPI & {binding: PhysicalInventoryDocHeader | PhysicalInventoryDocItem}} context */
export default function PhysicalInventoryDocHeaderGetRelatedWBS(context) {
    let wbsElement = '';
    if (context.binding['@odata.type'] === '#sap_mobile.PhysicalInventoryDocHeader') {
        wbsElement = !ValidationLibrary.evalIsEmpty(context.binding.PhysicalInventoryDocItem_Nav) && context.binding.PhysicalInventoryDocItem_Nav[0].WBSElement;
    } else if (context.binding['@odata.type'] === '#sap_mobile.PhysicalInventoryDocItem') {
        wbsElement = context.binding.WBSElement;
    }
    return wbsElement || '';
}
