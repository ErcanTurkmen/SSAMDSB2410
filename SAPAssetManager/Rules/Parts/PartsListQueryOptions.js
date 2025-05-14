import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import isDefenseEnabled from '../Defense/isDefenseEnabled';

export default function PartsListQueryOptions(context) {

    let searchString = context.searchString;
    let queryBuilder = context.dataQueryBuilder();

    let filterOpts = [];

    if (context.binding.OrderId) {
        filterOpts.push(`OrderId eq '${context.binding.OrderId}'`);
    }

    if (context.binding.OperationNo) {
        filterOpts.push(`OperationNo eq '${context.binding.OperationNo}'`);
    }
    queryBuilder.filter(filterOpts.join(' and '));

    if (searchString !== '') {
        queryBuilder.filter().and(getSearchQuery(context, searchString.toLowerCase()));
    }

    queryBuilder.orderBy('OperationNo','ItemNumber');
    queryBuilder.expand('Material', 'MaterialBatch_Nav', 'Material/MaterialSLocs');
    return queryBuilder;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['TextTypeDesc', 'ComponentDesc'];
        ModifyListViewSearchCriteria(context, 'MyWorkOrderComponent', searchByProperties);

        let customSearchQueries = [`substringof('${searchString}', MaterialNum) eq true`];
        if (isDefenseEnabled(context)) {
            customSearchQueries.push(`substringof('${searchString}', Material/NATOStockNum) eq true`);
            customSearchQueries.push(`substringof('${searchString}', Material/LongManufacturerPartNum) eq true`);
            customSearchQueries.push(`substringof('${searchString}', Material/ManufacturerPartNum) eq true`);
        }
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties, customSearchQueries);
    }

    return searchQuery;
}
