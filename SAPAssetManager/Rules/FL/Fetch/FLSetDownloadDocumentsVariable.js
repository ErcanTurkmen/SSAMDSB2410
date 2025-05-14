import FLDownloadDocuments from './FLDownloadDocuments';
import libCom from '../../Common/Library/CommonLibrary';

export default function FLSetDownloadDocumentsVariable(context) {
    let downloadStarted = libCom.getStateVariable(context, 'DownloadFLDocsStarted');
    if (!downloadStarted) {
        libCom.setStateVariable(context, 'DownloadFLDocsStarted', true);
        return FLDownloadDocuments(context);
    }
    return Promise.resolve();
}
