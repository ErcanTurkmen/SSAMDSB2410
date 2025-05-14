import libCommon from '../../Common/Library/CommonLibrary';

export default function SignatureCreateOnFailure(context) {
    libCommon.removeStateVariable(context, 'LAMSignature');
    libCommon.removeStateVariable(context, 'LAMConfirmCreate');
    libCommon.removeStateVariable(context, 'ContextMenuBindingObject');
    libCommon.removeStateVariable(context, 'GoodsRecipientSignatory');
    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateFailure.action');
}
