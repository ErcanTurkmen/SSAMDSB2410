import { CreateBDSLinks } from '../../../Documents/Create/DocumentCreateBDSLinkNoClose';

export default function SignatureOnCreateSuccess(context) {
    return CreateSignatureWCMDocumentItemBDSLink(context, context.binding, context.getActionResult('SignatureResult').data);
}

export function CreateSignatureWCMDocumentItemBDSLink(context, wcmDocumentItem, readlinks) {
    return CreateBDSLinks(context, readlinks, wcmDocumentItem['@odata.readLink'], 'WCMDocumentItems', 'WCMDocumentItems', 'WCMDocumentItemAttachments', { ObjectKey: wcmDocumentItem.ObjectNumber });
}
