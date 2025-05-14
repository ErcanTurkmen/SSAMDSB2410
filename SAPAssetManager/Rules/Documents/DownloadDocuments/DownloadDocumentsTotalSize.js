import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsTotalSize(context, documentsList) {
    let list = [];
    if (documentsList) {
        list = documentsList;
    } else {
        const { selectedDocuments } = libDoc.getDownloadDocumentsDataFromContext(context);
        if (selectedDocuments) {
            list = Object.values(selectedDocuments);
        }
    }

    return formatDocumentsSize(list);
}

export function formatDocumentsSize(documentsList) {
    let totalSizeLabel = '0 KB';

    const totalSize = documentsList.reduce((total, doc) => {
        return total + parseInt(doc.FileSize);
    }, 0);

    if (totalSize) {
        totalSizeLabel = libDoc.formatFileSize(totalSize);
    }

    return totalSizeLabel;
}
