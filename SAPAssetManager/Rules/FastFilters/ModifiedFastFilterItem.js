import { FAST_FILTERS } from './FastFilters';

export function ModifiedFastFilterItem(isModifiedQuery) {
    return {
        _Name: FAST_FILTERS.MODIFIED,
        _Type: 'Control.Type.FastFilterItem',
        FilterType: 'Filter',
        FilterProperty: '',
        DisplayValue: '$(L,pending_filter)',
        ReturnValue: isModifiedQuery,
        CustomQueryGroup: '',
        Label: '',
    };
}
