import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceItemDurationUOM(context) {
    let control = CommonLibrary.getControlProxy(context, 'TimeUnitLstPkr');
    let value = CommonLibrary.getControlValue(control);
    return value || '';
}
