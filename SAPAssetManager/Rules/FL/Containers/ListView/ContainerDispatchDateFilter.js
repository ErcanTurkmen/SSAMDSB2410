import CommonLibrary from '../../../Common/Library/CommonLibrary';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function ContainerDispatchDateFilter(context) {
    const result = CommonLibrary.SetFilterDatePickerVisibility(context, context.evaluateTargetPath('#Page:ContainersSearchFilterPage/#ClientData'), 'ContainersSearchFilterPage', 'DispatchDateSwitch', 'StartDateFilter', 'EndDateFilter');
    RedrawFilterToolbar(context);
    return result;
}
