import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Duration info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsDuration(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'Duration');
}
