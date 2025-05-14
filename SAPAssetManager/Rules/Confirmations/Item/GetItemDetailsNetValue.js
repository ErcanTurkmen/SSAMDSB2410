import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Net value data for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsNetValue(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'NetValue');
}
