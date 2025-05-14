import FilterSettings from '../../Filter/FilterSettings';

export default function ServiceQuotationsListPageDefaultFilters(context) {
    const defaultFilters = [context.createFilterCriteria(context.filterTypeEnum.Sorter, undefined, undefined, 
            ['QuotationEndDateTime desc'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('valid_to_date')])];
    FilterSettings.saveInitialFilterForPage(context, defaultFilters);
    
    return defaultFilters;
}
