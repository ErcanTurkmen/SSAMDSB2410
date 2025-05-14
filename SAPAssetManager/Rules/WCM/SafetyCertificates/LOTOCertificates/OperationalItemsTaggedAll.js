import { OpItemMobileStatusCodes } from '../../OperationalItems/libWCMDocumentItem';

/** @param {{binding: WCMDocumentHeader} & ISelectableSectionProxy} context  */
export default function OperationalItemsTaggedAll(context) {
    const wcmDocItems = context.binding.WCMDocumentItems || [];
    const doneMobileStatus = OpItemMobileStatusCodes.Tagged;
    return GetDoneSlashAllOperationalItemsDescription(wcmDocItems, doneMobileStatus, context);
}

export function GetDoneSlashAllOperationalItemsDescription(wcmDocItems, doneMobileStatus, context) {
    const doneCount = wcmDocItems.filter((/** @type {WCMDocumentItem} */ i) => doneMobileStatus === i.PMMobileStatus.MobileStatus).length;
    return context.localizeText('operational_items_count_xx', [doneCount, wcmDocItems.length]);
}
