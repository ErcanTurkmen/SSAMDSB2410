
/** @param {ISelectableSectionProxy} context  */
export default function OperationalItemsAll(context) {
    return context.localizeText('operational_items_count_x', [context.binding.WCMDocumentItems ? context.binding.WCMDocumentItems.length : 0]);
}
