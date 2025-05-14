import { OpItemMobileStatusCodes } from '../../OperationalItems/libWCMDocumentItem';
import { GetDoneSlashAllOperationalItemsDescription } from './OperationalItemsTaggedAll';

/** @param {{binding: WCMDocumentHeader} & ISelectableSectionProxy} context  */
export default function OperationalItemsUntaggedAll(context) {
    const wcmDocItems = context.binding.WCMDocumentItems || [];
    const untaggedMobileStatus = OpItemMobileStatusCodes.UnTagged;

    return GetDoneSlashAllOperationalItemsDescription(wcmDocItems, untaggedMobileStatus, context);
}
