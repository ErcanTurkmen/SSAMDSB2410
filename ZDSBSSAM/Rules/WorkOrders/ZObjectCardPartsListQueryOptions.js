import CommonLibrary from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../SAPAssetManager/Rules/LCNC/ModifyListViewSearchCriteria';

export default function ZObjectCardPartsListQueryOptions(context) {

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
    queryBuilder.top(4);
    return queryBuilder;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['TextTypeDesc', 'ComponentDesc'];
        ModifyListViewSearchCriteria(context, 'MyWorkOrderComponent', searchByProperties);

        let customSearchQueries = [`substringof('${searchString}', MaterialNum) eq true`];
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties, customSearchQueries);
    }

    return searchQuery;
}
