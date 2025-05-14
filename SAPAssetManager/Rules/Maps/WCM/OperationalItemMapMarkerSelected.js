import { GetWCMOperationalItemMapMarker } from './OperationalItemMapMarker';

const OperationalItemSelectedMarkerIconNames = Object.freeze({
    default: 'WCMOperationalItemSelected',
    highPriority: 'WCMOperationalItemSelectedHighPriority',
    tagged: 'WCMOperationalItemSelectedTagged',
    untagged: 'WCMOperationalItemSelectedUntagged',
});

export default function OperationalItemMapMarkerSelected(context) {
    return GetWCMOperationalItemMapMarker(context, OperationalItemSelectedMarkerIconNames);
}
