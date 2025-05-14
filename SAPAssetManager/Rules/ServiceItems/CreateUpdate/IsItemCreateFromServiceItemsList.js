import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function IsItemCreateFromServiceItemsList(context) {
    return !S4ServiceLibrary.isOnSOChangeset(context);
}
