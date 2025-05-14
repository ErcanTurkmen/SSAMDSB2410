import { ServiceRequestsFastFilters } from '../../FastFilters/S4FSMFastFilters/ServiceRequestsFastFilters';


/**
 * @typedef ServiceRequestsListPageClientData
 * @prop {ServiceRequestsFastFilters} serviceRequestsFastFilters
 */

export default function ServiceRequestsFastFiltersItems(context) {
    const serviceRequestsFastFilters = new ServiceRequestsFastFilters(context);

    context.getPageProxy().getClientData().serviceRequestsFastFilters = serviceRequestsFastFilters;
    return serviceRequestsFastFilters.getFastFilterItemsForListPage(context);
}


