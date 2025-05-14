import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestReasonCategory3(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'ReasonCategory3LstPkr');

    return value || nilGuid();
}
