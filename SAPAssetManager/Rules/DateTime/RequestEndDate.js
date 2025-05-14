import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function RequestEndDate(context) {
    let binding = context.binding;
    let endDate = binding.RequestedEnd;

    if (libVal.evalIsEmpty(endDate)) {
        return context.localizeText('no_request_end_date');
    }

    let odataDate = new OffsetODataDate(context, endDate);
    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return context.formatDatetime(odataDate.date(), '', '', {'format': 'short'});
    }
    return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
}
