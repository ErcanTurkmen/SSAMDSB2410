import getDocsData from './DocumentOnCreateGetStateVars';
import libCom from '../../Common/Library/CommonLibrary';

const CHILD_ITEMS_MAPPING = {
    'MyWorkOrderOperations': {
        'entitySet': 'MyWorkOrderHeaders',
        'parentKey': 'OrderId',
    },
    'S4ServiceQuotationItems': {
        'entitySet': 'S4ServiceQuotations',
        'parentKey': 'ObjectID',
    },
    'S4ServiceItems': {
        'entitySet': 'S4ServiceOrders',
        'parentKey': 'ObjectID',
    },
};

export default function DocumentOnCreateWorkOrderId(controlProxy) {
    const { parentEntitySet } = getDocsData(controlProxy);
    
    switch (parentEntitySet) {
        case 'MyWorkOrderOperations':
        case 'S4ServiceQuotationItems':
        case 'S4ServiceItems':
            return collectOrderIdForChildItems(controlProxy, parentEntitySet);
        default:
            return '0';
    }
}

function collectOrderIdForChildItems(controlProxy, parentEntitySet) {
    const id = libCom.getStateVariable(controlProxy, 'LocalId');

    if (id[0] === 'L') {
        const { entitySet, parentKey } = CHILD_ITEMS_MAPPING[parentEntitySet];

        let filter = `$filter=${parentKey} eq '${id}'`;
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
            if (result && result.length > 0) {
                let entity = result.getItem(0);
                return '<' + entity['@odata.readLink'] + ':' + parentKey + '>';
            } else {
                return '0';
            }
        });
    } else {
        return id;
    }
}
