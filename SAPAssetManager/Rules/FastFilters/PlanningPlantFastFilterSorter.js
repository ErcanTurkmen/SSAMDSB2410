
export function PlanningPlantFastFilterSorter() {
    return {
        _Name: 'PlanningPlant',
        _Type: 'Control.Type.FastFilterItem',
        FilterType: 'Sorter',
        ReturnValue: 'PlanningPlant',
        DisplayValue: '$(L,plant)',
        Label: '$(L,sort_filter_prefix)',
    };
}
