import ODataDate from '../../Common/Date/ODataDate';
import libCommon from '../../Common/Library/CommonLibrary';

export default function ServiceOrderDueByDateValue(context) {
    const dueBySwitchValue = libCommon.getTargetPathValue(context, '#Page:ServiceOrderCreateUpdatePage/#Control:DueBySwitch/#Value');
    const dueByDateControl = libCommon.getTargetPathValue(context, '#Page:ServiceOrderCreateUpdatePage/#Control:DueByDatePicker');
    
    if (dueBySwitchValue) {
        let date;
        if (dueByDateControl) {
            date = libCommon.getControlValue(dueByDateControl);
        }
    
        let odataDate = new ODataDate(date);
        return odataDate.toDBDateString(context);
    }

    return '';
}
