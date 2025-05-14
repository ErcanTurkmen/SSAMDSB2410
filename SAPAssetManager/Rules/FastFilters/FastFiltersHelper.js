
export default class FastFiltersHelper {

    static getFilterItem(displayValue = '', returnValue = '', filterProperty = '', customQueryGroup = '') {
        return {
            'FilterType': 'Filter',
            'DisplayValue': displayValue,
            'ReturnValue': returnValue,
            'FilterProperty': filterProperty,
            'CustomQueryGroup': customQueryGroup,
        };
    }

    static getSorterItem(displayValue = '', returnValue = '', filterLabel = '') {
        return {
            'FilterType': 'Sorter',
            'DisplayValue': displayValue,
            'ReturnValue': returnValue,
            'Label': filterLabel,
        };
    }

    static getAppliedFastFiltersFromContext(context) {
        let fastFilters = [];
        let pageFilterObject = context.getFilter();

        if (pageFilterObject && pageFilterObject.getFilters) {
            let pageFilters = pageFilterObject.getFilters() || [];
            fastFilters = pageFilters.filter(filter => {
                return filter.filterItems.length;
            });
        }
        return fastFilters;
    }

    static getFastFilterCriteria(context, caption = '', filterValues = [], displayValues = undefined) {
        if (displayValues) {
            return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, caption, filterValues, true, undefined, displayValues);
        }
        return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, caption, filterValues, true, undefined, [caption]);
    }

}
