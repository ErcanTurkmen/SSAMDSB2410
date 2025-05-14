import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function FirstResponseValue(context) {
    const binding = context.binding;
    const odataDate = new OffsetODataDate(context, binding.FirstResponseBy);

    return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
}
