import ChecklistFastFilters from '../../FastFilters/MTFastFilters/ChecklistFastFilters';

export default function InspectionLotFastFiltersItems(context) {
    /** 
        to customize the list of fast filters, the getFastFilters method must be overwritten in the ChecklistFastFilters class
        getFastFilters returns a list of filter objects
        each object contains:
        for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
        for sortes: caption, value, visible
    */
    let ChecklistFastFiltersClass = new ChecklistFastFilters(context);
    context.getPageProxy().getClientData().ChecklistFastFiltersClass = ChecklistFastFiltersClass;
    return ChecklistFastFiltersClass.getFastFilterItemsForListPage(context);
}
