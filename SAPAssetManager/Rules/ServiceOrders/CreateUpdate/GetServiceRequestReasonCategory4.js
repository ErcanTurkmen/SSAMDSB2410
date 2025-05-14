import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestReasonCategory4(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'ReasonCategory4LstPkr');

    return value || nilGuid();
}
