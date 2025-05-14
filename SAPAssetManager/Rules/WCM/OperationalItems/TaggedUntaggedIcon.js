import { OpItemMobileStatusCodes } from './libWCMDocumentItem';

export default function TaggedUntaggedIcon(context) {
    return GetOperationalItemTaggedIcon(context.binding);
}

function GetOperationalItemTaggedIcon(wcmDocumentItem) {
    return {
        [OpItemMobileStatusCodes.Tagged]: 'StatusLocked',
        [OpItemMobileStatusCodes.Untag]: 'StatusLocked',
        [OpItemMobileStatusCodes.UnTagged]: 'StatusUnlocked',
    }[wcmDocumentItem.PMMobileStatus?.MobileStatus] || '';
}
