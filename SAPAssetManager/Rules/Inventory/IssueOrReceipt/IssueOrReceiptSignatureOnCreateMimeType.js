import CommonLibrary from '../../Common/Library/CommonLibrary';
/**
* Get the mime type for the Signature
* @param {IClientAPI} context
*/
export default function IssueOrReceiptSignatreOnCreateMimeType(context) {
    return CommonLibrary.getStateVariable(context, 'signatureContentType') || context.getPageProxy().getControl('FormCellContainer').getControl('SignatureCaptureFormCell').getValue().contentType;
}
