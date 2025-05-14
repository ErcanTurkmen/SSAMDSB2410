import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function RequiredStartDate(context) {
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding.RequiredStartDate)) {
        return context.localizeText('no_required_start_date');
    }

    let odataDate = new OffsetODataDate(context,binding.RequiredStartDate, binding.RequiredStartTime);
    return context.formatDate(odataDate.date());
}
