import libCom from '../../Common/Library/CommonLibrary';

export default function IsOnUpdate(context) {
    const confirmationHideDiscardOption = libCom.getStateVariable(context, 'ConfirmationHideDiscardOption');
    if (confirmationHideDiscardOption) {
        return false;
    }
    return !context.getBindingObject().IsOnCreate;
}
