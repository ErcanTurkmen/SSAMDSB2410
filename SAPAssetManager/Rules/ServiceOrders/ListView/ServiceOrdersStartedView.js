import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import libWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import libVal from '../../Common/Library/ValidationLibrary';

/**
* Switch to ServiceOrdersListViewNav or ServiceItemsListViewNav with initial filter values
* @param {IControlProxy} context
*/
export default function ServiceOrdersStartedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDates = libWO.getActualDates(context);
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const TRAVEL = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
    const ONSITE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates).then(filter => {
                /** @type {import('./ServiceOrderListViewQueryOptions').ServiceOrdersListViewPageBinding} */
                const s4SOactionBinding = { filter: filter };
                context.getPageProxy().setActionBinding(s4SOactionBinding);

                return S4ServiceLibrary.isAnythingStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates);
                    });
                });
            });
        }
        return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates).then(filter => {
            /** @type {import('../Item/GetListItemCaption').ServiceItemsListViewPageClientData} */
            const s4ServiceRequestActionBinding = { filter: filter };
            context.getPageProxy().setActionBinding(s4ServiceRequestActionBinding);

            return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                    SetPredefinedItemsListFilters(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates);
                });
            });
        });
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return WorkOrdersFSMQueryOption(context).then(types => {
                return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
                    let filter = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}'
                    or OrderMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OrderMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                    
                    if (!libVal.evalIsEmpty(types)) {
                        filter += ' and ' + types;
                    }
                    
                    libCom.setStateVariable(context, 'DATE_FILTER', dateFilter);
                    libCom.setStateVariable(context, 'KPI-InProgressCS', true);
                    libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
                    return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
                        context.getPageProxy().getClientData().WORKORDER_FAST_FILTER_SHORT_LIST = false;
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                            SetPredefinedOrdersListFilters(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates);
                        });
                    });
                });
            });
        }
        return WorkOrderOperationsFSMQueryOption(context).then(types => {
            return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
                let filter = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}'
                or OperationMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OperationMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;

                if (!libVal.evalIsEmpty(types)) {
                    filter += ' and ' + types;
                }
                libCom.setStateVariable(context, 'KPI-InProgressCS', true);
                libCom.setStateVariable(context, 'OPERATIONS_DATE_FILTER', dateFilter);
                libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
                return libOpMobile.isAnyOperationStarted(context).then(() => {
                    context.getPageProxy().getClientData().OPERATIONS_FAST_FILTER_SHORT_LIST = false;
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                        SetPredefinedItemsListFilters(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates);
                    });
                });
            });
        });
    }
}
