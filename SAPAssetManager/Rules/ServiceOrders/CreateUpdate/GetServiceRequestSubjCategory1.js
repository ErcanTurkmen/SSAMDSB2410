import nilGuid from '../../Common/nilGuid';
import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function GetServiceRequestSubjCategory1(context) {
    let value = S4ServiceRequestControlsLibrary.getCategory(context, 'SubjectCategory1LstPkr');

    return value || nilGuid();
}
