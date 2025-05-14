import { CreateBDSLinks } from '../../Documents/Create/DocumentCreateBDSLinkNoClose';
import { getHeaderDetails, getObjectKeyByHeader } from './IssueApproval';
import DownloadAndSaveMedia from '../../Documents/DownloadAndSaveMedia';

export default function IssueApprovalSignatureCreateOnSuccess(context) {
    const header = getHeaderDetails(context.binding);
    let navLink = '';
    let docEntitySet = '';
    let objectKey = getObjectKeyByHeader(context, header);

    if (header['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue()) {
        navLink = 'WCMApplications';
        docEntitySet = 'WCMApplicationAttachments';
    } else {
        navLink = 'WCMDocumentHeaders';
        docEntitySet = 'WCMDocumentHeaderAttachments';
    }

    return CreateBDSLinks(context, context.getActionResult('SignatureResult').data, header['@odata.readLink'], navLink, navLink, docEntitySet, { ObjectKey: objectKey })
        .then(() => DownloadAndSaveMedia(context));
}

