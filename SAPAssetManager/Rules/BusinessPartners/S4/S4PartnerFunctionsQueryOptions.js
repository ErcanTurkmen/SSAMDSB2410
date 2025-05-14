
export default function S4PartnerFunctionsQueryOptions(context) {
    const query = context.dataQueryBuilder();
    query.orderBy('Description');
    if (context.binding?.ObjectType) {
        query.filter(`ObjectType eq '${context.binding?.ObjectType}'`);
    }
    return query;
}
