import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import libWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';

/**
* Switch to ServiceOrdersListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateView(context) {
    const actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDates = libWO.getActualDates(context);

    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [], defaultDates).then(filter => {

            /** @type {import('./ServiceOrderListViewQueryOptions').ServiceOrdersListViewPageBinding} */
            const s4actionBinding = { filter: filter, displayShortFastFilterItemList: true };
            context.getPageProxy().setActionBinding(s4actionBinding);
            return S4ServiceLibrary.isAnythingStarted(context).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                    SetPredefinedOrdersListFilters(context, '', defaultDates);
                });
            });
        });
    } else {
        return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                const filter = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=${dateFilter} and ${types}`;
                libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
                return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
                    context.getPageProxy().getClientData().WORKORDER_FAST_FILTER_SHORT_LIST = true;
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, '', defaultDates);
                    });
                });
            });
        });
    }
}
