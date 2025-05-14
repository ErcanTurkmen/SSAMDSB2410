import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import InspectionLotConstants from './InspectionLotLibrary';
import InspectionLotListViewFilter from './InspectionLotListViewFilter';

export default function InspectionLotListViewQueryOption(context) {
    let searchString = context.searchString;
    let filter = '';
    let queryBuilder;
    InspectionLotListViewFilter(context.getPageProxy());
    if (searchString) {
        filter = getSearchQuery(context, searchString.toLowerCase());
    }
    queryBuilder = InspectionLotConstants.getListQueryOptions(context);
    if (filter) {
        queryBuilder.filter(filter);
    }
    return queryBuilder;       
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['InspectionLot', 'InspectionLot_Nav/ShortDesc', 'OrderId', 'OperationNo'];
        ModifyListViewSearchCriteria(context, 'EAMChecklistLink', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
