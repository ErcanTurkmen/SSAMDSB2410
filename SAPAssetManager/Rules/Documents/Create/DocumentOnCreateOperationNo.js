import getDocsData from './DocumentOnCreateGetStateVars';
import libCom from '../../Common/Library/CommonLibrary';

export default function DocumentOnCreateOperationNo(controlProxy) {
    const { parentEntitySet, ObjectKey } = getDocsData(controlProxy);
    let id = libCom.getStateVariable(controlProxy, 'LocalId');
    let operationNo = libCom.getStateVariable(controlProxy, 'lastLocalOperationId');
    let itemNo = libCom.getStateVariable(controlProxy, 'lastLocalItemId');
    let filter = `$filter=${ObjectKey} eq '${id}'`;
    switch (parentEntitySet) {
        case 'MyWorkOrderOperations':
            filter = `$filter=OrderId eq '${id}' and ${ObjectKey} eq '${operationNo}'`;
            break;
        case 'S4ServiceQuotationItems':
        case 'S4ServiceItems':
            filter = `$filter=ObjectID eq '${id}' and ${ObjectKey} eq '${itemNo}'`;
            break;
        default:
            break;
    }
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', parentEntitySet, [], filter).then(result => {
        if (result && result.length > 0) {
            let entity = result.getItem(0);
            return '<' + entity['@odata.readLink'] + ':' + ObjectKey + '>';
        } else {
            return '0';
        }
    });
}
