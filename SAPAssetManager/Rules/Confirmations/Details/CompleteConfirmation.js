import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Complete Confirmation and related items
* @param {IClientAPI} clientAPI
*/
export default function CompleteConfirmation(clientAPI) {
    return S4ServiceLibrary.confirmationStatusUpdateConfirm(clientAPI);
}
