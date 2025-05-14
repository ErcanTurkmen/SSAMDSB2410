import { PriorityEnum } from '../../Priority/WOPriorityStatusStyle';
import { WCMWorkPermitMarkerIconNames } from './WorkPermitMapMarker';

export default function WorkPermitMapMarkerSelected(context) {
    return [PriorityEnum.emergencyPriority, PriorityEnum.veryHighPriority, PriorityEnum.highPriority].includes(context.binding.Priority) ? WCMWorkPermitMarkerIconNames.highPrioritySelected : WCMWorkPermitMarkerIconNames.defaultSelected;
}
