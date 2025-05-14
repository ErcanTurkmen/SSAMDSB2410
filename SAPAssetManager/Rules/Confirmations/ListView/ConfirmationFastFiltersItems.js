import ConfirmationFastFilters from '../../FastFilters/MultiPersonaFilters/ConfirmationFastFilters';

export default function ConfirmationFastFiltersItems(context) {
    /** 
        to customize the list of fast filters, the getFastFilters method must be overwritten in the ConfirmationFastFilters class
        getFastFilters returns a list of filter objects
        each object contains:
        for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
        for sortes: caption, value, visible
    */
    let ConfirmationFastFiltersClass = new ConfirmationFastFilters(context);
    return ConfirmationFastFiltersClass.getFastFilterItemsForListPage(context);
}
