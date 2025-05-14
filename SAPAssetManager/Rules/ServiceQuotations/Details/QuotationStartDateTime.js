import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function QuotationStartDateTime(context) {
    const binding = context.binding;
  
    if (binding.QuotationStartDateTime) {
        const odataDate = new OffsetODataDate(context, binding.QuotationStartDateTime);
        return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
    }

    return '-';
}
