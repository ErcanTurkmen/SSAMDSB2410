import TimesheetFastFilters from '../../../FastFilters/MTFastFilters/TimesheetFastFilters';

export default function TimeSheetFastFiltersItems(context) {
    /** 
        to customize the list of fast filters, the getFastFilters method must be overwritten in the TimesheetFastFilters class
        getFastFilters returns a list of filter objects
        each object contains:
        for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
        for sortes: caption, value, visible
    */
    let TimesheetFastFiltersClass = new TimesheetFastFilters(context);
    return TimesheetFastFiltersClass.getFastFilterItemsForListPage(context);
}
