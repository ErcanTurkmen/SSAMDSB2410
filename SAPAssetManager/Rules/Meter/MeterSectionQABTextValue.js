import MeterSectionLibrary from './Common/MeterSectionLibrary';

export default function MeterSectionQABTextValue(context) {
    return MeterSectionLibrary.quickActionTargetValues(context, 'Label', context.getPageProxy()?.binding);
}
