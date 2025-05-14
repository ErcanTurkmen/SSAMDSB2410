import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Getting all required fields to show in section
*/
export default function GetConfirmationDetailDataQuery() {
    return S4ServiceLibrary.getConfirmationDetailsQuery();
}
