import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function RequiredEndDate(context) {
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding.RequiredEndDate)) {
        return context.localizeText('no_required_end_date');
    }

    let odataDate = new OffsetODataDate(context,binding.RequiredEndDate, binding.RequiredEndTime);
    return context.formatDate(odataDate.date());
}
