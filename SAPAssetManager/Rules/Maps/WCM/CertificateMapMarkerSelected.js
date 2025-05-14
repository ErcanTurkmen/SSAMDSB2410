import { PriorityEnum } from '../../Priority/WOPriorityStatusStyle';
import { CertificateMapMarkerIconNames } from './CertificateMapMarker';

export default function CertificateMapMarkerSelected(context) {
    return [PriorityEnum.emergencyPriority, PriorityEnum.veryHighPriority, PriorityEnum.highPriority].includes(context.binding.Priority) ? CertificateMapMarkerIconNames.highPrioritySelected : CertificateMapMarkerIconNames.defaultSelected;
}
