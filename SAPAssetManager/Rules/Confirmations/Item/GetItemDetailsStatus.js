import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Status info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsStatus(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'Status');
}
