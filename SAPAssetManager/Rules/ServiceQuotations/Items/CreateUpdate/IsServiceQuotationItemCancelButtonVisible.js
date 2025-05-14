import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function IsServiceQuotationItemCancelButtonVisible(context) {
    return !S4ServiceLibrary.isOnSQChangeset(context);
}
