import DocLib from './DocumentLibrary';

export default function InitializeAttachments(formcellProxy) {
    const objectDetails = DocLib.getDocumentObjectDetail(formcellProxy);
    return DocLib.readAttachments(formcellProxy, objectDetails).then((result) => {
        // set initial count of attachments
        formcellProxy.getClientData().attachmentCount = result.length;

        return result;
    });
}
