import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function GetDateValue(context, dateField, timeField) {
    const binding = context.binding;
    const date = binding[dateField];
    const time = binding[timeField];

    if (libVal.evalIsEmpty(date)) {
        return '-';
    }

    let odataDate = new OffsetODataDate(context,date,time);
    return context.formatDate(odataDate.date());
}
