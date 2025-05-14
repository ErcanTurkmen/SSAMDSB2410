import ServiceOrderObjectType from '../../ServiceOrders/ServiceOrderObjectType';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export function DiscardS4ServiceConfirmation(context) {
    let confirmationLink = context.binding['@odata.id'];
    let orderType = ServiceOrderObjectType(context);

    let promises = [
        context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/TransHistories_Nav', [], `$filter=RelatedObjectType eq '${orderType}'`),
        context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/ServiceConfirmationItems_Nav', [], ''),
    ];

    return Promise.all(promises).then(results => {
        let transHistories = results[0];
        let items = results[1];
        let actions = [];

        if (transHistories && transHistories.length) {
            actions.push(callDiscardAction(context, transHistories.getItem(0)['@odata.readLink']));
        }
        
        if (items && items.length) {
            items.forEach(item => {
                actions.push(callDiscardAction(context, item['@odata.readLink']));
            });
        }

        return Promise.all(actions).then(() => {
            return callDiscardAction(context, confirmationLink, '/SAPAssetManager/Rules/Common/DeleteEntityOnSuccess.js');
        });
    });
}

export function DiscardS4ServiceConfirmationItem(context) {
    let confirmationLink = context.binding['@odata.id'];
    let successAction = IsCompleteAction(context) ? '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/AfterDiscardS4ServiceConfirmationItem.js' 
        : '/SAPAssetManager/Rules/Common/DeleteEntityOnSuccess.js';

    let promises = [
        context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/S4ServiceConfirmation_Nav/TransHistories_Nav', [], `$filter=sap.islocal() and ObjectID eq '${context.binding.ObjectID}' and ItemNo eq '${context.binding.ItemNo}'`),
    ];

    return Promise.all(promises).then(results => {
        let transHistories = results[0];
        let actions = [];

        if (transHistories && transHistories.length) {
            actions.push(callDiscardAction(context, transHistories.getItem(0)['@odata.readLink']));
        }

        return Promise.all(actions).then(() => {
            return callDiscardAction(context, confirmationLink, successAction);
        });
    });
}

function callDiscardAction(context, link, successAction = '') {
    let properties = {
        'OnSuccess': successAction,
        'OnFailure': '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action',
    };

    if (link) {
        let entitySet = link.split('(')[0];
        properties.Target = {
            'EntitySet': entitySet,
            'ReadLink':  link,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
        };
    }

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 
        'Properties': properties,
    });
}
