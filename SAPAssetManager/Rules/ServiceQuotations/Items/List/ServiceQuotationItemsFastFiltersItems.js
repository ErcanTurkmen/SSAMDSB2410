import { S4ServiceQuotationItemsFastFilters } from '../../../FastFilters/S4FSMFastFilters/S4ServiceQuotationItemsFastFilters';

export default function ServiceQuotationItemsFastFiltersItems(context) {
    const fastFiltersClass = new S4ServiceQuotationItemsFastFilters(context);
    
    return fastFiltersClass.getFastFilterItemsForListPage(context);
}
