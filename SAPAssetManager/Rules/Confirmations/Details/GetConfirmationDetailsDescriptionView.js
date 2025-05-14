import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* get confirmation description
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationDetailsDescriptionView(clientAPI) {
    return S4ServiceLibrary.getConfirmationDetailsData(clientAPI, 'Description');
}
