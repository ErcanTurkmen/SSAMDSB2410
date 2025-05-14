import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* get created by info
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationDetailsCreatedByView(clientAPI) {
    return S4ServiceLibrary.getConfirmationDetailsData(clientAPI, 'CreatedBy');
}
