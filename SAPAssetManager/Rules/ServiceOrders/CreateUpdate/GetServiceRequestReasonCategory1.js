import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestReasonCategory1(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'ReasonCategory1LstPkr');

    return value || nilGuid();
}
