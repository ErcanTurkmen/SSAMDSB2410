import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Complete Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function CompleteConfirmationItem(clientAPI) {
    return S4ServiceLibrary.confirmationItemStatusUpdateConfirm(clientAPI);
}
