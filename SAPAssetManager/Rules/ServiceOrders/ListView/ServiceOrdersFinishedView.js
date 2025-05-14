import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import libWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';

/**
* Switch to ServiceOrdersListViewNav or ServiceItemsListViewNav with initial filter values
* @param {IControlProxy} context
*/
export default function ServiceOrdersFinishedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDates = libWO.getActualDates(context);
    const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [COMPLETED], defaultDates).then(filter => {
                /** @type {import('./ServiceOrderListViewQueryOptions').ServiceOrdersListViewPageBinding} */
                const s4SOactionBinding = { filter: filter };
                context.getPageProxy().setActionBinding(s4SOactionBinding);

                return S4ServiceLibrary.isAnythingStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, [COMPLETED], defaultDates);
                    });
                });
            });
        } else {
            return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [COMPLETED], defaultDates).then(filter => {
                /** @type {import('../Item/GetListItemCaption').ServiceItemsListViewPageClientData} */
                const s4ServiceRequestActionBinding = { filter: filter };
                context.getPageProxy().setActionBinding(s4ServiceRequestActionBinding);

                return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                        SetPredefinedItemsListFilters(context, [COMPLETED], defaultDates);
                    });
                });
            });
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return WorkOrdersFSMQueryOption(context).then(types => {
                return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
                    if (!IsClassicLayoutEnabled(context)) {
                        libCom.setStateVariable(context, 'DATE_FILTER', dateFilter);
                    }

                    let filter = `$filter=OrderMobileStatus_Nav/MobileStatus eq '${COMPLETED}' and ${dateFilter}`;

                    if (!libVal.evalIsEmpty(types)) {
                        filter += ' and ' + types;
                    }

                    libCom.setStateVariable(context, IsClassicLayoutEnabled(context) ? 'KPI-Completed' : 'KPI-CompletedCS', true);
                    libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);

                    return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
                        context.getPageProxy().getClientData().WORKORDER_FAST_FILTER_SHORT_LIST = false;
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                            SetPredefinedOrdersListFilters(context, COMPLETED, defaultDates);
                        });
                    });
                });
            });
        } else {
            return libOperations.statusOperationFilter(context, COMPLETED, defaultDates, 'SchedEarliestStartDate').then(filter => {
                return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
                    libCom.setStateVariable(context, IsClassicLayoutEnabled(context) ? 'KPI-Completed' : 'KPI-CompletedCS', true);
                    libCom.setStateVariable(context, 'OPERATIONS_DATE_FILTER', dateFilter);
                    libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
                    return libOpMobile.isAnyOperationStarted(context).then(() => {
                        context.getPageProxy().getClientData().OPERATIONS_FAST_FILTER_SHORT_LIST = false;
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                            SetPredefinedItemsListFilters(context, COMPLETED, defaultDates);
                        });
                    });
                });
            });
        }
    }
}
