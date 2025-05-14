import { CreateBDSLinks } from '../../Documents/Create/DocumentCreateBDSLinkNoClose';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import DownloadAndSaveMedia from '../../Documents/DownloadAndSaveMedia';

export default function IssueOrReceiptSignatureCreateOnSuccess(context) {
    let header = '';
    let objectKey = '';
    if (context.binding?.AssociatedMaterialDoc) {
        header = context.binding.AssociatedMaterialDoc['@odata.readLink'];
        objectKey = context.binding.AssociatedMaterialDoc.MaterialDocNumber;
    } else if (context.binding?.TempHeader_Key) {
        header = context.binding.TempHeader_MatDocReadLink;
        objectKey = context.binding.TempHeader_Key;
    } else {
        context.currentPage.materialDocumentBinding = CommonLibrary.getStateVariable(context, 'CreateMaterialDocument') || CommonLibrary.getStateVariable(context, 'MaterialDocumentBulkUpdate');
        context.currentPage.readLink = context.currentPage.materialDocumentBinding['@odata.editLink'];
        objectKey = context.currentPage.materialDocumentBinding.MaterialDocNumber;
        header = context.currentPage.readLink;
    }

    CommonLibrary.removeStateVariable(context, 'GoodsRecipientSignatory');
    CommonLibrary.removeStateVariable(context, 'SGoodsRecipient');
    CommonLibrary.removeStateVariable(context, 'signature');
    CommonLibrary.removeStateVariable(context, 'signatureUser');
    CommonLibrary.removeStateVariable(context, 'WatermarkPlant');
    CommonLibrary.removeStateVariable(context, 'WatermarkStorageLocation');

    return CreateBDSLinks(context, context.getActionResult('IssueOrReceiptSignatureResult').data, header, 'MaterialDocument_Nav', 'MaterialDocuments', 'MatDocAttachments', { ObjectKey: objectKey })
        .then(() => DownloadAndSaveMedia(context));
}
