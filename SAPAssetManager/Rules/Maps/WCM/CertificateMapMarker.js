import { PriorityEnum } from '../../Priority/WOPriorityStatusStyle';

export const CertificateMapMarkerIconNames = Object.freeze({
    default: 'WCMLOTOCertificate',
    highPriority: 'WCMLOTOCertificateHighPriority',
    defaultSelected: 'WCMLOTOCertificateSelected',
    highPrioritySelected: 'WCMLOTOCertificateSelectedHighPriority',
});

export default function CertificateMapMarker(context) {
    return [PriorityEnum.emergencyPriority, PriorityEnum.veryHighPriority, PriorityEnum.highPriority].includes(context.binding.Priority) ? CertificateMapMarkerIconNames.highPriority : CertificateMapMarkerIconNames.default;
}
