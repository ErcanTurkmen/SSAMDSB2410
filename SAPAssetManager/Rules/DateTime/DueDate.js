import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function DueDate(context) {
    const binding = context.binding;
    let dueDate = binding.DueDate || binding.DueBy;
    if (libVal.evalIsEmpty(dueDate)) {
        return context.localizeText('no_due_date');
    }

    let odataDate = new OffsetODataDate(context, dueDate, binding.RequestEndTime);

    if (binding.DueBy) {
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            return context.formatDatetime(odataDate.date(), '', '', {'format': 'short'});
        }
        return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
    }

    return context.formatDate(odataDate.date());
}
