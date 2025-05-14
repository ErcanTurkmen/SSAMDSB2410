import libCom from '../../Common/Library/CommonLibrary';
/**
 * 
 * @param {*} context 
 * @returns Error message
 */
export default function FLFetchDocumentsErrorMessage(context) {
    libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
    return context.Error.ErrorMessage;
}
