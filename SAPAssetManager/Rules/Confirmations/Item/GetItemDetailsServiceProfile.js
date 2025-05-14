import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Service profile info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsServiceProfile(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'ServiceProfile');
}
