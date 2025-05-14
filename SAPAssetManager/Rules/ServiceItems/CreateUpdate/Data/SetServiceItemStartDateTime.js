import OffsetODataDate from '../../../Common/Date/OffsetODataDate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SetServiceItemStartDateTime(context) {
    const binding = context.binding || {};
    if (!CommonLibrary.IsOnCreate(context) && (binding['@odata.type'] === '#sap_mobile.S4ServiceItem' || binding === '#sap_mobile.S4ServiceQuotationItem')) {
        let odataDate = new OffsetODataDate(context, binding.RequestedStart);
        return odataDate.date();
    }

    return new Date();
}
