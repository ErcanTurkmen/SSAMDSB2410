import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function GetSIServiceContractItemValue(clientAPI) {
    return S4ServiceLibrary.getServiceContractFromTransHistory(clientAPI, clientAPI.binding, true);
}
