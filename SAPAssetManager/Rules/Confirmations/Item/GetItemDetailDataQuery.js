import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Getting all required fields to show in section
*/
export default function GetItemDetailDataQuery() {
    return S4ServiceLibrary.getConfirmationItemDetailsQuery();
}
