import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestReasonCategory2(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'ReasonCategory2LstPkr');

    return value || nilGuid();
}
