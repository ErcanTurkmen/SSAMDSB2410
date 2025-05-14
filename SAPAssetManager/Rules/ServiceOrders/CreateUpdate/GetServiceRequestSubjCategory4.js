import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestSubjCategory4(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'SubjectCategory4LstPkr');

    return value || nilGuid();
}
