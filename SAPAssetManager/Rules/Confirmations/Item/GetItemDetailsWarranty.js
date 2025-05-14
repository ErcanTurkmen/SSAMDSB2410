import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Warranty info for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsWarranty(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'WarrantyID');
}
