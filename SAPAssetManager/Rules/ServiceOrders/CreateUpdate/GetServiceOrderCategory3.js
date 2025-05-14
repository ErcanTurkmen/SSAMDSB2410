import S4ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';
import nilGuid from '../../Common/nilGuid';

export default function GetServiceItemCategory3(context) {
    let value = S4ServiceOrderControlsLibrary.getCategory(context, 'Category3LstPkr');

    return value || nilGuid();
}
