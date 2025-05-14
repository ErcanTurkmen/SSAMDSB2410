import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Get label of service contract item based on service contract selected
* or if travel expence enabled
* @param {IClientAPI} clientAPI
* @param {String} srContractId
*/
export default function GetSIServiceContractItemCaption(clientAPI) {
    const required = S4ServiceLibrary.getServiceContractItemRequiredFromAppParam(clientAPI);
    const label = clientAPI.localizeText('service_contract_item');
    return `${label}${required ? '*' : ''}`;
}
