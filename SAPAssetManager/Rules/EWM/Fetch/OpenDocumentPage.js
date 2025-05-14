import libCom from '../../Common/Library/CommonLibrary';
import libEWM from '../Common/EWMLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';
/**
* Used to make an extension of simple close of the page
* if there are only one doc dowloaded, it make redirect to the details page
* if there is openend any modal of fetch doc - it would be closed
* @param {IClientAPI} context
*/
export default function OpenDocumentPage(context) {
    libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
    const pageName = libCom.getPageName(context);
    const previousPage = libCom.getPreviousPageName(context);
    if (pageName === 'EWMFetchOnlineDocumentsPage' || pageName === 'EWMFetchDocumentsPage') {
        if (previousPage !== 'EWMOverviewPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return modifyDocs(context);
        });
    }
    return modifyDocs(context);
}

function modifyDocs(context) {
    let documents = libCom.getStateVariable(context, 'Documents');
    if (documents.length === 1) {
        return openDoc(context, documents[0]);
    }
    return Promise.resolve(true);
}

function openDoc(context, document) {
    const autoOpenEnabled = (libCom.getAppParam(context, 'EWM', 'search.auto.navigate') === 'Y');
    if (autoOpenEnabled && !libCom.getStateVariable(context, 'EWMResource')) {
        let query = '$filter=';
        if (document.DocumentType === DocumentTypes.WarehouseOrder) {
            query = query + `WarehouseNo eq '${document.WarehouseNo}' and WarehouseOrder eq '${document.WarehouseOrder}'&$expand=WarehouseTask_Nav,WarehouseProcessType_Nav`;
            return libEWM.openEWMDocDetailsPage(context, 'WarehouseOrders', query);
        }
    }
    return Promise.resolve(true);
}
