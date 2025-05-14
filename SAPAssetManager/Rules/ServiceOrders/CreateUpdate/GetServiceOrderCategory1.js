import nilGuid from '../../Common/nilGuid';
import S4ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';

export default function GetServiceItemCategory1(context) {
    let value = S4ServiceOrderControlsLibrary.getCategory(context, 'Category1LstPkr');

    return value || nilGuid();
}
