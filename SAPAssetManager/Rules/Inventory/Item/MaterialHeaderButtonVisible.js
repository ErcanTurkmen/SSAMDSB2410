import libCom from '../../Common/Library/CommonLibrary';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function MaterialHeaderButtonVisible(context, ignoreMDoc = false) {
    const isMDocItem = context.binding.item['@odata.type'].includes('MaterialDocItem');
    const isFromMdoc = libCom.getStateVariable(context, 'BlockIMNavToMDocHeader');
    return isMDocItem && (ignoreMDoc || !isFromMdoc);
}
