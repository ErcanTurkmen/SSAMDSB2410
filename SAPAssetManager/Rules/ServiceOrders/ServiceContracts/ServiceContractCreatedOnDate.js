import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import libVal from '../../Common/Library/ValidationLibrary';

export default function ServiceContractCreatedOnDate(context) {
    const binding = context.binding;
    if (!libVal.evalIsEmpty(binding.CreatedOn)) {
        let odataDate = new OffsetODataDate(context, binding.CreatedOn);
        return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
    } else {
        return '-';
    }
}
