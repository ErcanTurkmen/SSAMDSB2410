import CommonLibrary from '../../../Common/Library/CommonLibrary';
import nilGuid from '../../../Common/nilGuid';

export default function GetServiceItemCategory3(context) {
    let control = CommonLibrary.getControlProxy(context, 'Category3LstPkr');
    let value = CommonLibrary.getControlValue(control);

    return value || nilGuid();
}
