import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get service contract value
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationServiceContractValue(clientAPI) {
    return S4ServiceLibrary.getConfirmationDetailsData(clientAPI, 'ContractAccount');
}
