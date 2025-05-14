
export default function WorkOrderHistoryLongText(context) {
    if (context.binding.LongTextExists === 'E') {
        let historyLongText = context.binding.HistoryLongText;
        if (Object.prototype.hasOwnProperty.call(historyLongText,'TextString')) {
            return historyLongText.TextString;
        } else {
            return '';
        }
    } else {
        return '';
    }
}
