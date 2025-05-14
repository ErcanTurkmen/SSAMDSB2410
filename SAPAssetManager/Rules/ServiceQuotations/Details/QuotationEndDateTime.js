import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function QuotationEndDateTime(context) {
    const binding = context.binding;
  
    if (binding.QuotationEndDateTime) {
        const odataDate = new OffsetODataDate(context, binding.QuotationEndDateTime);
        return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
    }

    return '-';
}
