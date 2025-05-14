
export default async function ServiceConfirmationsListViewDefaultFilters(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, undefined, undefined, ['MobileStatus_Nav/MobileStatus desc'], true, context.localizeText('sort_filter_prefix'), [context.localizeText('status')])];
}
