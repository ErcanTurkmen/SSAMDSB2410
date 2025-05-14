import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Amount data for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsAmount(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'Amount');
}
