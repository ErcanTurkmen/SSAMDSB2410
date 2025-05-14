import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptSignatureFailure(context) {
    CommonLibrary.removeStateVariable(context, 'GoodsRecipientSignatory');
    CommonLibrary.removeStateVariable(context, 'signature');
    CommonLibrary.removeStateVariable(context, 'signatureUser');
    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateFailure.action');
}
