import MeterSectionLibrary from './Common/MeterSectionLibrary';
import MeterReadingsUpdateNav from './MeterReadingsUpdateNav';

/**
* Nav to take readings with custom binding
* @param {IClientAPI} context
*/
export default function MeterReadingsFromDetailsNav(context) {
    const replaceBinding = MeterSectionLibrary.getMeterReplaceBinding(context);
    return MeterReadingsUpdateNav(context, replaceBinding);
}
