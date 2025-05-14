import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function NotificationRequiredEndDate(context) {
    const binding = context.getBindingObject();
    if (binding.RequiredEndDate) {
        const odataDate = OffsetODataDate(context, binding.RequiredEndDate);
        return context.formatDate(odataDate.date());
    } else {
        return context.localizeText('no_due_date');
    }
}
