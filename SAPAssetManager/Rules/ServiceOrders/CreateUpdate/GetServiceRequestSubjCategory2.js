import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestSubjCategory2(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'SubjectCategory2LstPkr');

    return value || nilGuid();
}
