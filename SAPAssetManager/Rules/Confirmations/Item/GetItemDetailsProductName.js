import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Product name data for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsProductName(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'ProductName');
}
