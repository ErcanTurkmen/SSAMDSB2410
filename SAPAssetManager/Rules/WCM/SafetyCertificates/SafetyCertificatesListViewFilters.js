export default function SafetyCertificatesListViewFilters(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'Priority', undefined, ['Priority'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('priority')])];
}
