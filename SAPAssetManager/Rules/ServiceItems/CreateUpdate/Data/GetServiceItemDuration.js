import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceItemDuration(context) {
    let control = CommonLibrary.getControlProxy(context, 'PlannedDurationSimple');
    let value = CommonLibrary.getControlValue(control);

    return value || 0;
}
