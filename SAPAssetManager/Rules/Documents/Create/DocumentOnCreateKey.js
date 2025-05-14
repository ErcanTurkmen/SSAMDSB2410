import libCom from '../../Common/Library/CommonLibrary';
import getDocsData from './DocumentOnCreateGetStateVars';

export default function DocumentOnCreateKey(controlProxy) {
    let key = '';
    const { parentEntitySet, ObjectKey } = getDocsData(controlProxy);
    let id = libCom.getStateVariable(controlProxy, 'LocalId');
    let filter = `$filter=${ObjectKey} eq '${id}'`;
    if (parentEntitySet === 'S4ServiceItems' || parentEntitySet === 'S4ServiceQuotationItems') {
        let itemNo = libCom.getStateVariable(controlProxy, 'lastLocalItemId');
        filter = `$filter=ObjectID eq '${id}' and ${ObjectKey} eq '${itemNo}'`;
    }
    if (parentEntitySet === 'MyWorkOrderOperations') {
        let operationNo = libCom.getStateVariable(controlProxy, 'lastLocalOperationId');
        filter = `$filter=OrderId eq '${id}' and ${ObjectKey} eq '${operationNo}'`;
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
    }
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', parentEntitySet, [], filter).then(result => {
        if (result && result.length > 0) {
            let entity = result.getItem(0);
            return '<' + entity['@odata.readLink'] + ':' + ObjectKey + '>';
        } else {
            return key;
        }
    });
}
