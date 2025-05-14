import S4ErrorsLibrary from './S4ErrorsLibrary';

export default function S4ErrorsListQueryOptions(context) {
    let query = '$orderby=ItemNo,Message';

    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem' || context.binding['@odata.type'] === '#sap_mobile.S4ServiceQuotationItem') {
        const errors = S4ErrorsLibrary.filterErrorMessagesByItemNo(context.binding.S4ServiceErrorMessage_Nav, context.binding.ItemNo);
        const filterString = errors.map(error => `MessageNumber eq '${error.MessageNumber}'`).join(' or ');
        if (filterString) {
            query += `&$filter=${filterString}`;
        }
    }

    return query;
}
