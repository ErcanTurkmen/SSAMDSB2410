import ODataDate from '../../../Common/Date/ODataDate';

export default function TimeEntryViewDate(context) {
    const date = context.binding.Date;
    let odataDate = new ODataDate(date);
    return context.formatDate(odataDate.date());
}
