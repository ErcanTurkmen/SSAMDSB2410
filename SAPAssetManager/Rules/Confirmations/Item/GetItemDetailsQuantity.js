import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Quantity info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsQuantity(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'Quantity');
}
