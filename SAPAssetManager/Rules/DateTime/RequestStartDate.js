import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function RequestStartDate(context) {
    let binding = context.binding;
    let startDate = binding.RequestStartDate || binding.RequestedStart;
    if (libVal.evalIsEmpty(startDate)) {
        return context.localizeText('no_request_start_date');
    }

    let odataDate = new OffsetODataDate(context, startDate, binding.RequestStartTime);

    if (binding.RequestedStart) {
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            return context.formatDatetime(odataDate.date(), '', '', {'format': 'short'});
        }
        return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
    }

    return context.formatDate(odataDate.date());
}
