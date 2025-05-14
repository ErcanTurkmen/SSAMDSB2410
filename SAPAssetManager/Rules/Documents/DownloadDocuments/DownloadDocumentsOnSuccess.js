import Logger from '../../Log/Logger';
import QABRedrawExtension from '../../QAB/QABRedrawExtension';
import DownloadDocumentsTotalSize from './DownloadDocumentsTotalSize';

export default async function DownloadDocumentsOnSuccess(context) {
    const errors = [];

    const clientData = context.getClientData();
    const selectedDocumentsList = clientData.selectedDocumentsList;
    const totalSize = DownloadDocumentsTotalSize(context, selectedDocumentsList, true);
    const totalLength = selectedDocumentsList.length;

    delete clientData.selectedDocumentsList;

    const documentsDefiningRequests = selectedDocumentsList.map(doc => ({
        'Name': doc['@odata.id'].replace(/[()=',]/g, ''),
        'Query': doc['@odata.readLink'],
        'AutomaticallyRetrievesStreams': true,
    }));

    context.updateProgressBanner(context.localizeText('download_documents_downloading_x_documents', [totalLength, totalSize]));

    // Download action for document
    await context.executeAction({
        'Name': '/SAPAssetManager/Actions/Documents/DownloadDocumentStreams.action',
        'Properties': {
            'DefiningRequests': documentsDefiningRequests,
            'OnSuccess': '',
            'OnFailure': '',
        },
    }).catch((error) => {
        Logger.error(`Download streams action failed: ${error}`);
        errors.push({
            errorText: error.replace(/\[(.*)\]\s*/g, ''),
        });
    }).finally(() => {
        QABRedrawExtension(context);
    });

    if (errors.length) {
        clientData.downloadDocumentsErrors = errors;

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Documents/DownloadDocumentsFailedToDownload.action',
            'Properties': {
                'Message': context.localizeText('x_documents_failed_to_download', [documentsDefiningRequests.length]),
            },
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentsSuccess.action');
}
