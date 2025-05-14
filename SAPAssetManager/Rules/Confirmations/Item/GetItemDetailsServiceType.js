import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Service type info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsServiceType(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'ServiceType');
}
