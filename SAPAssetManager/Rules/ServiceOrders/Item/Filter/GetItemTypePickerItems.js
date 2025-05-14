import S4ServiceLibrary from '../../S4ServiceLibrary';

/**
 * @param {IClientAPI} context
 * @returns {Promise<{DisplayValue: string, ReturnValue: string}[]>}
 */
export default function GetItemTypePickerItems(context) {
    return Promise.all([
        S4ServiceLibrary.getItemsCategoriesFilterQuery(context, S4ServiceLibrary.getServiceProductItemCategories(context)),
        S4ServiceLibrary.getItemsCategoriesFilterQuery(context, S4ServiceLibrary.getServiceProductPartCategories(context)),
        S4ServiceLibrary.getItemsCategoriesFilterQuery(context, S4ServiceLibrary.getServiceProductExpenseCategories(context)),
    ]).then(([itemFiltes, partFilters, expenseFilters]) => [
        [itemFiltes, context.localizeText('service_item')],
        [partFilters, context.localizeText('part')],
        [expenseFilters, context.localizeText('expense')],
    ]).then(result => result.map(([filter, caption]) => ({
        'DisplayValue': caption,
        'ReturnValue': filter,
    })));
}
