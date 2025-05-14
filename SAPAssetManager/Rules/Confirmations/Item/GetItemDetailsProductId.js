import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get ProductId data for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsProductId(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'ProductID');
}
