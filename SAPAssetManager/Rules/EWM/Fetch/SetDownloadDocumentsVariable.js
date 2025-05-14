import DownloadDocuments from './DownloadDocuments';
import libCom from '../../Common/Library/CommonLibrary';

export default function SetDownloadDocumentsVariable(context) {
    let downloadStarted = libCom.getStateVariable(context, 'DownloadEWMDocsStarted');
    if (!downloadStarted) {
        libCom.setStateVariable(context, 'DownloadEWMDocsStarted', true);
        return DownloadDocuments(context);
    }
    return Promise.resolve();
}
