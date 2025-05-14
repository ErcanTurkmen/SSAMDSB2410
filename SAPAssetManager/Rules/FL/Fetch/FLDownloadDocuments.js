import libVal from '../../Common/Library/ValidationLibrary';
import errorLibrary from '../../Common/Library/ErrorLibrary';
import logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';

export default function FLDownloadDocuments(context) {

    const documents = libCom.getStateVariable(context, 'Documents');

    if (libVal.evalIsEmpty(documents)) {
        const messageText = context.localizeText('document_quantity_zero_error');
        const captionText = context.localizeText('error');
        return libCom.showErrorDialog(context, messageText, captionText);
    }

    return documents.reduce((promise, document) => {
        return promise.then(() => {
            libCom.setStateVariable(context, 'ObjectId', document.ObjectId);
            libCom.setStateVariable(context, 'ObjectType', document.FLObject);
            libCom.setStateVariable(context, 'Action', 'I');
            return context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action')
                .catch((error) => {
                    libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
                    logger.error('DownloadDocuments', error);
                });
        });
    }, Promise.resolve())
        .then(() => {
            errorLibrary.clearError(context);
            return context.executeAction('/SAPAssetManager/Actions/FL/Fetch/FLFetchDocumentsProgressBanner.action');
        });
}
