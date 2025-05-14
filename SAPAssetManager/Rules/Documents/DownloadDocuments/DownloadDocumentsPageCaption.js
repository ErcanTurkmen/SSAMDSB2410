import libDoc from '../DocumentLibrary';


export default function DownloadDocumentsPageCaption(context) {
    const { selectedDocuments, documentsList } = libDoc.getDownloadDocumentsDataFromContext(context);

    let documents = documentsList.map(documentsInfo => {
        return documentsInfo.documents;
    }).flat();
    if (documents) {
        const allCount = documents.length;
        const selectedCount = selectedDocuments && Object.keys(selectedDocuments).length;
        return allCount === selectedCount || selectedCount === undefined ? context.localizeText('documents_x', [allCount]) : context.localizeText('documents_x_x', [selectedCount, allCount]);
    }

    return context.localizeText('documents');
}
