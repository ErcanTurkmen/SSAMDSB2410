import EqipmentStatus from './EqipmentStatus';

export default function EqipmentStatusReadLink(context) {
    const status = EqipmentStatus(context);
    return `SystemStatuses('${status}')`;
}
