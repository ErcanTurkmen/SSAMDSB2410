import QueryBuilder from '../../../Common/Query/QueryBuilder';

export default function SubServiceItemQueryOptions(context, useExpand = true, useTop = true) {
    const queryBuilder = new QueryBuilder();
    if (useExpand) {
        queryBuilder.addAllExpandStatements(['S4ServiceErrorMessage_Nav', 'ItemCategory_Nav', 'MobileStatus_Nav', 'Product_Nav']);
    }
    if (useTop) {
        queryBuilder.addExtra('top=2');
    }
    const parentItemNo = context.binding.ItemNo.padStart(10, 0);
    queryBuilder.addFilter(`ObjectID eq '${context.binding.ObjectID}' and HigherLvlItem eq '${parentItemNo}'`);
    return queryBuilder.build();
}   
