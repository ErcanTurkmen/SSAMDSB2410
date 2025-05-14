import libCommon from '../../Common/Library/CommonLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function WorkOrderDueDate(context) {
    const binding = context.binding;

    if (libCommon.isDefined(binding.WOHeader?.DueDate)) {
        let odataDate = new OffsetODataDate(context, binding.WOHeader.DueDate, binding.WOHeader.RequestEndTime);
        return context.formatDate(odataDate.date());
    } else if (libCommon.isDefined(binding.WorkOrderOperation?.WOHeader?.DueDate)) {
        let odataDate = new OffsetODataDate(context, binding.WorkOrderOperation.WOHeader.DueDate, binding.WorkOrderOperation.WOHeader.RequestEndTime);
        return context.formatDate(odataDate.date());
    } else if (binding?.['@odata.type'] === '#sap_mobile.WorkOrderOperation' && binding.Header?.DueDate) { // online operation case
        let odataDate = new OffsetODataDate(context, binding.Header.DueDate, binding.Header.RequestEndTime);
        return context.formatDate(odataDate.date());
    }
    
    return context.localizeText('no_due_date');
}
