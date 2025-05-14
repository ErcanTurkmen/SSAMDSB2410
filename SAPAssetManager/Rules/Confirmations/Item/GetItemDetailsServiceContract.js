import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Service contract info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsServiceContract(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'ServiceContract');
}
