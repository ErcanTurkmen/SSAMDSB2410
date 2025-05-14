import SubOperationFastFilters from '../../FastFilters/MTFastFilters/SubOperationFastFilters';

export default function SubOperationFastFiltersItems(context) {
    let SubOperationFastFiltersClass = new SubOperationFastFilters(context);

    return prepareDataForSubOperationFastFilters(context, SubOperationFastFiltersClass).then(() => {
       
        /** 
            to customize the list of fast filters, the getFastFilters method must be overwritten in the SubOperationFastFilters class
            getFastFilters returns a list of filter objects
            each object contains:
            for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
            for sortes: caption, value, visible
        */
        return SubOperationFastFiltersClass.getFastFilterItemsForListPage(context);
    });
}

export function prepareDataForSubOperationFastFilters(context, SubOperationFastFiltersClass) {
    let promises = [];

    if (SubOperationFastFiltersClass.isConfirmedStatusFilterVisible(context)) {
        promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', ['OrderId', 'OperationNo', 'SubOperationNo', 'Confirmations/ConfirmationCounter', 'Confirmations/FinalConfirmation'], '$orderby=Confirmations/ConfirmationCounter desc&$expand=Confirmations&$filter=sap.entityexists(Confirmations) and Confirmations/any(confirmation:confirmation/FinalConfirmation eq \'X\')'));
    }

    return Promise.all(promises).then(results => {
        context.getPageProxy().getClientData().SubOperationFastFiltersClass = SubOperationFastFiltersClass;

        let confirmedIds = [];
        if (results[0] && results[0].length) {
            results[0].forEach(result => {
                if (result.Confirmations[0].FinalConfirmation === 'X') {
                    confirmedIds.push(`(OrderId eq '${result.OrderId}' and OperationNo eq '${result.OperationNo}' and SubOperationNo eq '${result.SubOperationNo}')`);
                }
            });
        }
        if (confirmedIds.length) {
            let query = confirmedIds.join(' or ');
            SubOperationFastFiltersClass.setConfigProperty('confirmedFilterQuery', query);
        }

        return Promise.resolve();
    });
}
