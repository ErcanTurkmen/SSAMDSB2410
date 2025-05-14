import S4ServiceLibrary from '../S4ServiceLibrary';

export default function GetPreselectedFilter(context) {
    const filter = S4ServiceLibrary.getServiceItemsFilterCriterias(context) || [];
    context.getClientData().initialFilter = filter.map(filterCriteria => filterCriteria.filterItems).filter(criteria => !!criteria);
    
    return filter;
}
