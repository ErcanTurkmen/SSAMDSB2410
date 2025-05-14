/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function FetchDocumentsErrorMessage(context) {
    libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
    return context.Error.ErrorMessage;
}
