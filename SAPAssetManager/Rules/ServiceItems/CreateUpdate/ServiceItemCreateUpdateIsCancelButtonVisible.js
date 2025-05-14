import S4Lib from '../../ServiceOrders/S4ServiceLibrary';

export default function ServiceItemCreateUpdateIsCancelButtonVisible(context) {
    return !S4Lib.isOnSOChangeset(context);
}
