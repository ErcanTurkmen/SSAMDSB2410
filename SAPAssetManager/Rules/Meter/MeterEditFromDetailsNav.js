import MeterSectionLibrary from './Common/MeterSectionLibrary';
import MeterUpdateNav from './MeterUpdateNav';

/**
* Nav to edit screens not from Meter details
* @param {IClientAPI} context
*/
export default function MeterEditFromDetailsNav(context) {
    const replaceBinding = MeterSectionLibrary.getMeterReplaceBinding(context);
    return MeterUpdateNav(context, replaceBinding);
}
