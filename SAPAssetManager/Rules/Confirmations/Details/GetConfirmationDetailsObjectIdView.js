import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get object id details
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationDetailsObjectIdView(clientAPI) {
    return S4ServiceLibrary.getConfirmationDetailsData(clientAPI, 'ObjectID');
}
