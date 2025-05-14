import { OpItemMobileStatusCodes } from '../../WCM/OperationalItems/libWCMDocumentItem';

const OperationalItemMarkerIconNames = Object.freeze({
    default: 'WCMOperationalItem',
    highPriority: 'WCMOperationalItemHighPriority',
    tagged: 'WCMOperationalItemTagged',
    untagged: 'WCMOperationalItemUntagged',
});

export default function OperationalItemMapMarker(context) {
    return GetWCMOperationalItemMapMarker(context, OperationalItemMarkerIconNames);
}

export function GetWCMOperationalItemMapMarker(context, markerNames) {
    return {
        [OpItemMobileStatusCodes.Tagged]: markerNames.tagged,
        [OpItemMobileStatusCodes.Untag]: markerNames.tagged,
        [OpItemMobileStatusCodes.UnTagged]: markerNames.untagged,
    }[context.binding.PMMobileStatus?.MobileStatus] || markerNames.default;
}
