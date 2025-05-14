import nilGuid from '../../Common/nilGuid';
import S4ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';

export default function GetServiceItemCategory2(context) {
    let value = S4ServiceOrderControlsLibrary.getCategory(context, 'Category2LstPkr');

    return value || nilGuid();
}
