import ODataDate from '../../Common/Date/ODataDate';

export default function SetServiceQuotationValidFromDateValue(context) {
    const binding = context.binding || {};
    
    if (binding.QuotationStartDateTime) {
        let odataDate = new ODataDate(binding.QuotationStartDateTime);
        return odataDate.toLocalDateString();
    }

    return new Date();
}
