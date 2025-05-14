import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function GetDateTimeValue(context, dateField, timeField, emptyTextKey) {
    const binding = context.binding;
    const date = binding[dateField];
    if (libVal.evalIsEmpty(date)) {
        return emptyTextKey ? context.localizeText(emptyTextKey) : '-';
    }
    const time = binding[timeField];

    let odataDate = new OffsetODataDate(context, date, time);
    return context.formatDatetime(odataDate.date());
}
