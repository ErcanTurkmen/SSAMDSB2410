import IsOnCreate from '../../Common/IsOnCreate';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function GetSIServiceContractValue(clientAPI) {
    return IsOnCreate(clientAPI) ? '' : S4ServiceLibrary.getServiceContractFromTransHistory(clientAPI, clientAPI.binding);
}
