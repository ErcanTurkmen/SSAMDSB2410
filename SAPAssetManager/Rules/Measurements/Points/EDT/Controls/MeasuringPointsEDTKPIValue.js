import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import EDTHelper from '../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTKPIValue(context) {
    let sections = CommonLibrary.getStateVariable(context, 'EDTSectionBindings');
    let points = sections.flat();
    let {allCount, completedCount} = EDTHelper.getSectionCompletionCounts(context, points);

    return completedCount + '/' + allCount;
}
