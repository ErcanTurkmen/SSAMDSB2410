import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import ServiceResuestsListViewCaption from './ServiceRequestsListViewCaption';

export default function ServiceRequestsListQueryOptions(context) {
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('Priority_Nav,MobileStatus_Nav,RefObj_Nav,RefObj_Nav/MyFunctionalLocation_Nav,RefObj_Nav/MyEquipment_Nav,Document/Document');
    queryBuilder.orderBy('ObjectID,Description,DueBy');

    let searchString = context.searchString;
    if (searchString) {
        queryBuilder.filter(getSearchQuery(context, searchString.toLowerCase()));
    }

    const captionQueryBuilder = context.dataQueryBuilder(queryBuilder);
    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(context.getPageProxy().getControl('SectionedTable'));
    if (sectionedTableFilterTerm) {
        captionQueryBuilder.filter(sectionedTableFilterTerm);
    }
    return captionQueryBuilder.build().then(query => {
        ServiceResuestsListViewCaption(context, true, query);
        return queryBuilder;
    });
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'Priority_Nav/Description', 'ObjectID'];
        ModifyListViewSearchCriteria(context, 'S4ServiceRequest', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
