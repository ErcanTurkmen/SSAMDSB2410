import OperationFastFilters from '../../../FastFilters/MultiPersonaFilters/OperationFastFilters';

export default function OperationFastFiltersItems(context) {
    let OperationFastFiltersClass = new OperationFastFilters(context);

    return prepareDataForFastFilters(context, OperationFastFiltersClass).then(() => {

        /** 
            to customize the list of fast filters, the getFastFilters method must be overwritten in the OperationFastFilters class
            getFastFilters returns a list of filter objects
            each object contains:
            for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
            for sortes: caption, value, visible
         */
        return OperationFastFiltersClass.getFastFilterItemsForListPage(context);
    });
}

function prepareDataForFastFilters(context, OperationFastFiltersClass) {
    let promises = [];

    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderDocuments', ['OrderId', 'OperationNo'], '$filter=sap.hasPendingChanges()'));    
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', ['OrderId', 'OperationNo'], '$filter=sap.hasPendingChanges() and sap.entityexists(WOOperation_Nav)'));
    
    if (OperationFastFiltersClass.isConfirmedStatusFilterVisible(context)) {
        promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', ['OrderId', 'OperationNo', 'Confirmations/ConfirmationCounter', 'Confirmations/FinalConfirmation'], '$orderby=Confirmations/ConfirmationCounter desc&$expand=Confirmations&$filter=sap.entityexists(Confirmations) and Confirmations/any(confirmation:confirmation/FinalConfirmation eq \'X\')'));
    }

    context.getPageProxy().getClientData().OperationFastFiltersClass = OperationFastFiltersClass;

    return Promise.all(promises).then(results => {
        prepareModifiedDataFilter(OperationFastFiltersClass, results);  

        if (results[2] && results[2].length) {
            prepareConfirmedDataFilter(OperationFastFiltersClass, results[2]);
        }

        return Promise.resolve();
    });
}

function prepareModifiedDataFilter(OperationFastFiltersClass, modifiedItems) {
    let ids = [];
    addPendingSyncObjectsId(modifiedItems[0], ids);
    addPendingSyncObjectsId(modifiedItems[1], ids);

    if (ids.length) {
        let query = ids.join(' or ');
        OperationFastFiltersClass.setConfigProperty('modifiedFilterQuery', query);
    }
}

function prepareConfirmedDataFilter(OperationFastFiltersClass, confirmedOperations) {
    let confirmedIds = [];

    confirmedOperations.forEach(operation => {
        if (operation.Confirmations[0].FinalConfirmation === 'X') {
            confirmedIds.push(`(OrderId eq '${operation.OrderId}' and OperationNo eq '${operation.OperationNo}')`);
        }
    });

    if (confirmedIds.length) {
        let query = confirmedIds.join(' or ');
        OperationFastFiltersClass.setConfigProperty('confirmedFilterQuery', query);
    }
}

function addPendingSyncObjectsId(pendingObjects, ids) {
    if (pendingObjects.length) {
        pendingObjects.forEach(pendingObject => {
            if (pendingObject.OrderId && pendingObject.OperationNo) {
                ids.push(`(OrderId eq '${pendingObject.OrderId}' and OperationNo eq '${pendingObject.OperationNo}')`);
            }
        });
    }
}
