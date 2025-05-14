import ODataDate from '../../Common/Date/ODataDate';

export default function SetServiceQuotationValidToDateValue(context) {
    const binding = context.binding || {};
    
    if (binding.QuotationEndDateTime) {
        let odataDate = new ODataDate(binding.QuotationEndDateTime);
        return odataDate.toLocalDateString();
    }

    return new Date();
}
