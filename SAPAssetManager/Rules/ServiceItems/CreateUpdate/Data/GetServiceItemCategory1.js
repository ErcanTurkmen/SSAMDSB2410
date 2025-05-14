import CommonLibrary from '../../../Common/Library/CommonLibrary';
import nilGuid from '../../../Common/nilGuid';

export default function GetServiceItemCategory1(context) {
    let control = CommonLibrary.getControlProxy(context, 'Category1LstPkr');
    let value = CommonLibrary.getControlValue(control);

    return value || nilGuid();
}
