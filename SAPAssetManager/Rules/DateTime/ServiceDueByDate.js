import CommonLibrary from '../Common/Library/CommonLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
/**
* Getting time period of SO from binding and making it in correct format
* @param {IClientAPI} context
*/
export default function ServiceDueByDate(context) {
    const binding = context.binding;

    if (ValidationLibrary.evalIsEmpty(binding)) {
        return '';
    }
    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem' && !S4ServiceLibrary.checkIfItemIsServiceItem(context, binding)) {
        return context.formatCurrency(binding.NetValue, binding.Currency, '', { 'maximumFractionDigits': 1, 'useGrouping': true });
    }
    if (CommonLibrary.isDefined(binding.DueBy)) {
        return context.formatDate(OffsetODataDate(context, binding.DueBy).date(), '', '', { 'format': 'short' });
    }
    return context.localizeText('no_due_date');
}
