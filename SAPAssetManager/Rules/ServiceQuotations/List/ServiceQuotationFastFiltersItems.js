import { S4ServiceQuotationFastFilters } from '../../FastFilters/S4FSMFastFilters/S4ServiceQuotationFastFilters';

export default function ServiceQuotationFastFiltersItems(context) {
    const fastFiltersClass = new S4ServiceQuotationFastFilters(context);
    
    /** 
        to customize the list of fast filters, the getFastFilters method must be overwritten in the S4ServiceQuotationFastFilters class
        getFastFilters returns a list of filter objects
        each object contains:
        for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with 'or'), visible
        for sortes: caption, value, visible
        */
    return fastFiltersClass.getFastFilterItemsForListPage(context);
}
