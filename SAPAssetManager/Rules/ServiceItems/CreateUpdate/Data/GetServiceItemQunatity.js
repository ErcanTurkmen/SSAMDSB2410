import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceItemQunatity(context) {
    let control = CommonLibrary.getControlProxy(context, 'QuantitySimple');
    let value = CommonLibrary.getControlValue(control);

    return value || 0;
}
