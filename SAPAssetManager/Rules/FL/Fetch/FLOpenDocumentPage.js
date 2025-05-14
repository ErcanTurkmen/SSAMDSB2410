import libCom from '../../Common/Library/CommonLibrary';
import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';
/**
* Used to make an extension of simple close of the page
* if there are only one doc dowloaded, it make redirect to the details page
* if there is openend any modal of fetch doc - it would be closed
* @param {IClientAPI} context
*/
export default function FLOpenDocumentPage(context) {
    libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
    const pageName = libCom.getPageName(context);
    const previousPage = libCom.getPreviousPageName(context);
    if (pageName === 'FLFetchOnlineDocuments' || pageName === 'FLFetchDocuments') {
        if (previousPage !== 'FLOverviewPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return modifyDocs(context);
        });
    }
    return modifyDocs(context);
}

function modifyDocs(context) {
    const documents = libCom.getStateVariable(context, 'Documents');
    const autoOpenEnabled = (libCom.getAppParam(context, 'FL', 'search.auto.navigate') === 'Y');
    if (documents.length === 1 && autoOpenEnabled) {
        switch (documents[0].FLObject) {
            case FLDocumentTypeValues.Voyage:
                return openVoyageDetailsPage(context, documents[0]);
            default:
                return Promise.resolve(true);
        }
    }
    return Promise.resolve(true);
}

function openVoyageDetailsPage(context, document) {
    return FLLibrary.openDocumentDetailsPage(context, 'FldLogsVoyages', `$filter=VoyageStageUUID eq '${document.ObjectId}'`, document.FLObject);
}
