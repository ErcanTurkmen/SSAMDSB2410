import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';

/**
* Get items count
* @param {IClientAPI} context
*/
export default function MetersKPIValueForPoints(context) {
    return MeterSectionLibrary.kpiHeaderTargetValues(context, 'Value', context.getPageProxy()?.binding);
}
