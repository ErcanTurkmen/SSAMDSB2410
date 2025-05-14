import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Request start date for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsRequestStart(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'RequestedStart');
}
