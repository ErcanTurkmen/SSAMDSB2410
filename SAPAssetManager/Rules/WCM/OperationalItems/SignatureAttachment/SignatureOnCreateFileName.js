import WCMDocumentItemSequence from '../WCMDocumentItemSequence';
import DocumentsBDSListEntitySet from '../../../Documents/DocumentsBDSListEntitySet';
import libVal from '../../../Common/Library/ValidationLibrary';

export default async function SignatureOnCreateFileName(context) {
    const wcmDocumentItem = context.binding;
    const fileType = context.evaluateTargetPath('#Control:SignatureCaptureFormCell/#Value').contentType.split('/')[1];
    const customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Signature/SignatureLOTOPrefix.global').getValue();
    const itemNumber = WCMDocumentItemSequence(context, wcmDocumentItem);
    let signatureFileName = `${customerSignaturePrefix}_${wcmDocumentItem.WCMDocument}_${itemNumber}`;

    let signatureSeq = 1;

    // get all signature attachments
    const result = await context.read('/SAPAssetManager/Services/AssetManager.service', DocumentsBDSListEntitySet(context), [], `$expand=Document&$orderby=Document/FileName desc&$filter=substringof('${signatureFileName.toLowerCase()}',tolower(Document/FileName))&$top=1`);
    if (!libVal.evalIsEmpty(result)) {
        // name of file with last signature sequence
        const fileName = result.getItem(0).Document.FileName;
        const lastSignatureSeq = fileName.substring(0, fileName.lastIndexOf('.')).replace(signatureFileName, '').split('_')[1];
        if (libVal.evalIsNumeric(lastSignatureSeq)) {
            signatureSeq = Number(lastSignatureSeq) + 1;
        }
    }

    return `${signatureFileName}_${context.formatNumber(signatureSeq, '', { minimumIntegerDigits: 2, maximumFractionDigits: 0, useGrouping: false })}.${fileType}`;
}
