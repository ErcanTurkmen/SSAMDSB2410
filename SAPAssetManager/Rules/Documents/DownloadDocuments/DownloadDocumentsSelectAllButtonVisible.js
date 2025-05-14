import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsSelectAllButtonVisible(context) {
    const { selectedDocuments } = libDoc.getDownloadDocumentsDataFromContext(context);

    return !!selectedDocuments && !Object.keys(selectedDocuments).length;
}
