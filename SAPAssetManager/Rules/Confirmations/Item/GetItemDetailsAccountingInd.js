import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Accounting indicator info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsAccountingInd(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'AccountingInd');
}
