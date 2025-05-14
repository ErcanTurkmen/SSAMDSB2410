import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Service contract item info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsServiceContractItem(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'ServiceContractItem');
}
