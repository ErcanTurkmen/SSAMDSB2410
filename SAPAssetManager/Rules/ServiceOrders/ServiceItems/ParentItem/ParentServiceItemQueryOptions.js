import QueryBuilder from '../../../Common/Query/QueryBuilder';

export default function ParentServiceItemQueryOptions(context) {
    const queryBuilder = new QueryBuilder();
    // HigherLvlItem is a 10-character property; ItemNo is a 6-character property 
    // To make the value in a uniform format, cut the extra characters from HigherLvlItem by slice
    const parentItemNo = context.binding.HigherLvlItem ? context.binding.HigherLvlItem.slice(-6) : '';
    queryBuilder.addAllExpandStatements(['S4ServiceErrorMessage_Nav', 'ItemCategory_Nav', 'MobileStatus_Nav', 'Product_Nav']);
    queryBuilder.addFilter(`ObjectID eq '${context.binding.ObjectID}' and ItemNo eq '${parentItemNo}'`);
    return queryBuilder.build();
}
