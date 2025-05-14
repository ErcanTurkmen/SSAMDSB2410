import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetIsFinalServiceConfirmation(context) {
    let value = CommonLibrary.getControlProxy(context, 'IsFinalConfirmation').getValue();
    return value ? 'Y' : 'N';
}
