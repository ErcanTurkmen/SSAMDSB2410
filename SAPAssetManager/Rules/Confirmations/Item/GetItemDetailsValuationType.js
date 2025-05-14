import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get Valuation type data for S4 Confirmation Item
* @param {IClientAPI} clientAPI
*/
export default function GetItemDetailsValuationType(clientAPI) {
    return S4ServiceLibrary.getConfirmationItemDetailsData(clientAPI, 'ValuationType');
}
