import CommonLibrary from '../../../Common/Library/CommonLibrary';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function PackageDispatchDateFilter(context) {
    const result = CommonLibrary.SetFilterDatePickerVisibility(context, context.evaluateTargetPath('#Page:PackagesSearchFilterPage/#ClientData'), 'PackagesSearchFilterPage', 'DispatchDateSwitch', 'StartDateFilter', 'EndDateFilter');
    RedrawFilterToolbar(context);
    return result;
}
