import S4ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';
import nilGuid from '../../Common/nilGuid';

export default function GetServiceItemCategory4(context) {
    let value = S4ServiceOrderControlsLibrary.getCategory(context, 'Category4LstPkr');

    return value || nilGuid();
}
