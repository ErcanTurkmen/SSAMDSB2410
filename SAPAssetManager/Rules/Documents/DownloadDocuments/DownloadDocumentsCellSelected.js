import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsCellSelected(context) {
    const { pageProxyClientData } = libDoc.getDownloadDocumentsDataFromContext(context);

    if (pageProxyClientData.selectedDocuments) {
        return !!pageProxyClientData.selectedDocuments[context.binding.DocumentID];
    }

    return true;
}
