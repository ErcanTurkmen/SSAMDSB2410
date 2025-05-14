import DatePickerVisibleSwitchChanged from '../Common/DatePickerVisibleSwitchChanged';
import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function SafetyCertificatesFilterPageDateVisibilityChanged(context) {
    const isVisibleSliderName = context.getName();
    RedrawFilterToolbar(context);
    DatePickerVisibleSwitchChanged(context, isVisibleSliderName);
}
