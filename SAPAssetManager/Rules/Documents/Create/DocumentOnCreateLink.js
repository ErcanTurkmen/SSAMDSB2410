import libCom from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import DownloadAndSaveMedia from '../../Documents/DownloadAndSaveMedia';
import { CreateDocumentLinkPromises } from './DocumentCreateBDSLinkNoClose';
import getDocsData from './DocumentOnCreateGetStateVars';

export default function DocumentOnCreateLink(controlProxy) {
    const { parentEntitySet, parentProperty, ObjectKey, entitySet } = getDocsData(controlProxy);
    let localId = libCom.getStateVariable(controlProxy, 'LocalId');
    let filter = `$filter=${ObjectKey} eq '${localId}'`;
    if (parentEntitySet === 'S4ServiceItems' || parentEntitySet === 'S4ServiceQuotationItems') {
        const itemNo = libCom.getStateVariable(controlProxy, 'lastLocalItemId');
        filter = `$filter=ObjectID eq '${localId}' and ${ObjectKey} eq '${itemNo}'`;
    }
    if (parentEntitySet === 'MyWorkOrderOperations') {
        let operationNo = libCom.getStateVariable(controlProxy, 'lastLocalOperationId');
        filter = `$filter=OrderId eq '${localId}' and ${ObjectKey} eq '${operationNo}'`;
    }
    if (parentEntitySet === 'MaterialDocuments') {
        let matdocNumber = '';
        let matdocYear = '';
        if (libCom.getStateVariable(controlProxy, 'lastLocalmaterialDocNumber')) {
            matdocNumber = libCom.getStateVariable(controlProxy, 'lastLocalmaterialDocNumber');
            matdocYear = libCom.getStateVariable(controlProxy, 'lastLocalmaterialDocYear'); 
        } else if (libCom.getStateVariable(controlProxy, 'MaterialDocNumberBulkUpdate')) {
            matdocNumber = libCom.getStateVariable(controlProxy, 'MaterialDocNumberBulkUpdate');
            matdocYear = libCom.getStateVariable(controlProxy, 'MaterialDocYearBulkUpdate');
        } else {
            matdocNumber = controlProxy.binding.TempHeader_Key;
            matdocYear = controlProxy.binding.TempHeader_MaterialDocYear;
        } 
            filter = `$filter=MaterialDocYear eq '${matdocYear}' and ${ObjectKey} eq '${matdocNumber}'`;
            localId = matdocNumber;
    }
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', parentEntitySet, [], filter).then(result => {
        if (ValidationLibrary.evalIsEmpty(result)) {
            return '';
        }
        const entity = result.getItem(0);
        const parentReadLink = entity['@odata.readLink'];
        const properties = { ObjectKey: localId };
        const readLinks = controlProxy.getClientData().mediaReadLinks;
        const promises = CreateDocumentLinkPromises(controlProxy, readLinks, parentReadLink, parentProperty, parentEntitySet, entitySet, properties);
        return Promise.all(promises).then(() => {
            DownloadAndSaveMedia(controlProxy);
        }).catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
    });
}
