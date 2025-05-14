import ODataDate from '../../Common/Date/ODataDate';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceQuotationValidFromDateValue(context) {
    const validFromDateControl = CommonLibrary.getTargetPathValue(context, '#Page:ServiceQuotationCreateUpdatePage/#Control:ValidFromDatePicker');
    
    let date;
    if (validFromDateControl) {
        date = CommonLibrary.getControlValue(validFromDateControl);
    }

    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}
