import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import dateLabel from '../../DateTime/DateLabel';
/**
* Providing actual header to the map component
* @param {IClientAPI} context
*/
export default function HeaderMapInfo(context) {
    const { lowerBound, upperBound } = libWO.getActualDates(context);
    let dateLabelText;
    // if dates are equal
    if (upperBound.getTime() - lowerBound.getTime() === 0) {
        dateLabelText = _getDateLabel(context, lowerBound);
    } else {
        dateLabelText = `${_getDateLabel(context, lowerBound)} - ${_getDateLabel(context, upperBound)}`;
    }
    return context.localizeText('route_day', [dateLabelText]);
}

function _getDateLabel(context, date) {
    const actualValue = dateLabel(date);
    let actualDate = context.formatDate(date);
    switch (actualValue) {
        case 'today':
            actualDate = context.localizeText('day_today');
            break;
        case 'yesterday':
            actualDate = context.localizeText('day_yesterday');
            break;
        default:
            break;
    }
    return actualDate;
}
