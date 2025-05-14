import IsTimelineControlVisible from '../../TimelineControl/IsTimelineControlVisible';

export default function IsTimelineVisible(context) {
    return IsTimelineControlVisible(context.getPageProxy());
}
