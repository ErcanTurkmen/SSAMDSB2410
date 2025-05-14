import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import { isAssignment1or2 } from '../../ServiceOrders/ListView/ServiceOrderFastFiltersItems';


export class ServiceRequestsFastFilters extends FastFiltersWithStatuses {

    /** @param {{binding: S4ServiceRequest} & IClientAPI} context */
    constructor(context) {
        const config = {
            statusPropertyPath: 'MobileStatus_Nav/MobileStatus',
        };
        const filterPageName = 'ServiceRequestFilterPage';
        const listPageName = 'ServiceRequestsListViewPage';
        super(context, filterPageName, listPageName, config);
    }

    getFastFilters(context) {
        return [
            {
                name: STATUS_FAST_FILTERS.STATUS_STARTED,
                value: this._getStartedFilterItemReturnValue(),
                group: STATUS_FILTER_GROUP,
                visible: this.isStatusFilterVisible(context),
            },
            {
                name: STATUS_FAST_FILTERS.STATUS_COMPLETED,
                value: this._getCompletedFilterItemReturnValue(),
                group: STATUS_FILTER_GROUP,
                visible: this.isStatusFilterVisible(context),
            },
        ];
    }

    isStatusFilterVisible(context) {
        return isAssignment1or2(context);
    }
}
