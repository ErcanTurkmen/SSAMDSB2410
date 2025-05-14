export default function ResourceListQuery(context, queryOnly = false) {
    let searchString = context.searchString;
    let filters = [];
    let filter = '';
if (queryOnly) {
        return '';
    }
    let queryBuilder = context.dataQueryBuilder();

    if (searchString) {
        searchString = context.searchString.toUpperCase();
        filters.push(`Resource eq '*${searchString}*'`);
    }
    if (filters.length > 0) {
        filter = filters.join(' or ');  
        queryBuilder.filter(filter); 
    }
    return queryBuilder;
}
