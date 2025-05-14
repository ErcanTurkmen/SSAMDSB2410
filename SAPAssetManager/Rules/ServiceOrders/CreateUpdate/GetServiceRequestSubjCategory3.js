import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestSubjCategory3(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'SubjectCategory3LstPkr');

    return value || nilGuid();
}
