import ODataDate from '../../Common/Date/ODataDate';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceQuotationValidToDateValue(context) {
    const validToDateControl = CommonLibrary.getTargetPathValue(context, '#Page:ServiceQuotationCreateUpdatePage/#Control:ValidToDatePicker');
    
    let date;
    if (validToDateControl) {
        date = CommonLibrary.getControlValue(validToDateControl);
    }

    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}
