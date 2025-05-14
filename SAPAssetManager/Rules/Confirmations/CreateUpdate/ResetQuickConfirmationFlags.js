import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ResetQuickConfirmationFlags(context) {
    CommonLibrary.removeStateVariable(context, 'ConfirmationNoActionsReturnVariableName');
    CommonLibrary.removeStateVariable(context, 'ConfirmationHideCancelOption');
    CommonLibrary.removeStateVariable(context, 'ConfirmationHideDiscardOption');
}
