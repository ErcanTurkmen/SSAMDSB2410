import libDoc from '../DocumentLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import DownloadDocumentsTotalSize from './DownloadDocumentsTotalSize';

export default function DownloadDocumentsOnDownloadPress(context, documentsList) {
    let selectedDocumentsList = [];

    if (!libVal.evalIsEmpty(documentsList)) {
        selectedDocumentsList = documentsList;
    } else {
        const { selectedDocuments } = libDoc.getDownloadDocumentsDataFromContext(context);
        selectedDocumentsList = Object.values(selectedDocuments);
    }

    if (libVal.evalIsEmpty(selectedDocumentsList)) {
        return context.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentsNothingSelected.action');
    }

    context.evaluateTargetPath('#Page:-Previous/#ClientData').selectedDocumentsList = selectedDocumentsList;

    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')
        .then(() => {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Documents/DownloadDocumentsProgressBanner.action',
                'Properties': {
                    'Message': context.localizeText('download_documents_downloading_x_documents', [selectedDocumentsList.length, DownloadDocumentsTotalSize(context, selectedDocumentsList, true)]),
                    'OnSuccess': '/SAPAssetManager/Rules/Documents/DownloadDocuments/DownloadDocumentsOnSuccess.js',
                },
            });
    });
}
