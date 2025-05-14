import CommonLibrary from '../../../Common/Library/CommonLibrary';
import nilGuid from '../../../Common/nilGuid';

export default function GetServiceItemCategory2(context) {
    let control = CommonLibrary.getControlProxy(context, 'Category2LstPkr');
    let value = CommonLibrary.getControlValue(control);

    return value || nilGuid();
}
