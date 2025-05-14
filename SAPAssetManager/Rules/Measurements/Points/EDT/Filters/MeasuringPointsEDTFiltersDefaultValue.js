
export default function MeasuringPointsEDTFiltersDefaultValue(context) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;

    if (filters.active) {
        switch (context.getName()) {
            case 'Equipment': {
                return filters.active.equipment;
            }
            case 'FuncLoc': {
                return filters.active.floc;
            }
            case 'FilterPRT': {
                return !!filters.active.prt;
            }
            case 'FilterSeg': {
                return filters.active.statuses;
            }
            case 'Operations':
            case 'S4Items': {
                return filters.active.operations;
            }
            default:
                return '';
        }
    }

    return '';
}
