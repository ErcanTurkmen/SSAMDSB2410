import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get warranty data
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationWarrantyValue(clientAPI) {
    return S4ServiceLibrary.getConfirmationDetailsData(clientAPI, 'WarrantyID');
}
