import { PriorityEnum } from '../../Priority/WOPriorityStatusStyle';

export const WCMWorkPermitMarkerIconNames = Object.freeze({
    default: 'WCMWorkPermit',
    highPriority: 'WCMWorkPermitHighPriority',
    defaultSelected: 'WCMWorkPermitSelected',
    highPrioritySelected: 'WCMWorkPermitSelectedHighPriority',
});

export default function WorkPermitMapMarker(context) {
    return [PriorityEnum.emergencyPriority, PriorityEnum.veryHighPriority, PriorityEnum.highPriority].includes(context.binding.Priority) ? WCMWorkPermitMarkerIconNames.highPriority : WCMWorkPermitMarkerIconNames.default;
}
