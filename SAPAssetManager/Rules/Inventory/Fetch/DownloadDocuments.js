import libVal from '../../Common/Library/ValidationLibrary';
import errorLibrary from '../../Common/Library/ErrorLibrary';
import logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DownloadDocuments(context, index) {

    let documents = libCom.getStateVariable(context, 'Documents');
    if (libVal.evalIsEmpty(index)) {
        index = 0;
    }

    if (!libVal.evalIsEmpty(documents) && documents.length > 0) {
        if (documents && documents.length > 0 && documents.length > index) {
            if (!documents[index].ObjectId && documents[index].OrderId) {
                libCom.setStateVariable(context, 'ObjectId', documents[index].OrderId);
            } else {
                libCom.setStateVariable(context, 'ObjectId', documents[index].ObjectId);
            }
            libCom.setStateVariable(context, 'ObjectType', documents[index].IMObject);
            libCom.setStateVariable(context, 'Action', 'I');
            return context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action').then(() => {
                index = index + 1;
                return DownloadDocuments(context, index);
            }).catch((error) => {
                logger.error('DownloadDocuments', error);
                index = index + 1;
                return DownloadDocuments(context, index);
            });
        }
        errorLibrary.clearError(context);
        return context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/FetchDocumentsProgressBanner.action');
    } else { //Nothing selected, so show error dialog
        const messageText = context.localizeText('document_quantity_zero_error');
        const captionText = context.localizeText('error');
        return libCom.showErrorDialog(context, messageText, captionText);
    }
}
