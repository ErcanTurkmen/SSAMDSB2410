import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import liWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';

/**
* Switch to ServiceOrdersListViewNav or ServiceItemsListViewNav with initial filter values
* @param {IControlProxy} context
*/
export default function ServiceOrdersAcceptedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDates = libWO.getActualDates(context);
    const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const ACCEPTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            const isClassicView = libCom.getPageName(context) === 'FieldServiceOverviewClassic';
            let statusArray;

            if (isClassicView) {
                statusArray = [RECEIVED, ACCEPTED]; //Classic overview
            } else {
                statusArray = [ACCEPTED]; //New overview
            }
            return S4ServiceLibrary.ordersDateStatusFilterQuery(context, statusArray, defaultDates).then(filter => {
                /** @type {import('./ServiceOrderListViewQueryOptions').ServiceOrdersListViewPageBinding} */
                const s4SOactionBinding = { filter: filter };
                context.getPageProxy().setActionBinding(s4SOactionBinding);

                return S4ServiceLibrary.isAnythingStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, statusArray, defaultDates);
                    });
                });
            });
        } else {
            return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [ACCEPTED], defaultDates).then(filter => {
                /** @type {import('../Item/GetListItemCaption').ServiceItemsListViewPageClientData} */
                const s4ServiceRequestActionBinding = { filter: filter };
                context.getPageProxy().setActionBinding(s4ServiceRequestActionBinding);

                return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                        SetPredefinedItemsListFilters(context, [ACCEPTED], defaultDates);
                    });
                });
            });
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
                libCom.setStateVariable(context, 'DATE_FILTER', dateFilter);
                return WorkOrdersFSMQueryOption(context).then(types => {
                    let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or OrderMobileStatus_Nav/MobileStatus eq '${ACCEPTED}') and ${dateFilter}`;

                    if (!libVal.evalIsEmpty(types)) {
                        queryOption += ' and ' + types;
                    }

                    libCom.setStateVariable(context, !IsClassicLayoutEnabled(context) ? 'KPI-OpenCS' : 'KPI-NotStarted', true);
                    libCom.setStateVariable(context, 'WORKORDER_FILTER', queryOption);
                    return liWOMobile.isAnyWorkOrderStarted(context).then(() => {
                        context.getPageProxy().getClientData().WORKORDER_FAST_FILTER_SHORT_LIST = false;
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                            SetPredefinedOrdersListFilters(context, [RECEIVED, ACCEPTED], defaultDates);
                        });
                    });
                });
            });
        } else {
            return WorkOrderOperationsFSMQueryOption(context).then(types => {
                return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
                    const filterQuery = IsClassicLayoutEnabled(context) ? '' : `OperationMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or `;
                    let filter = `$filter=(${filterQuery}OperationMobileStatus_Nav/MobileStatus eq '${ACCEPTED}') and ${dateFilter}`;

                    if (!libVal.evalIsEmpty(types)) {
                        filter += ' and ' + types;
                    }
                    libCom.setStateVariable(context, IsClassicLayoutEnabled(context) ? 'KPI-NotStarted' : 'KPI-OpenCS', true);
                    libCom.setStateVariable(context, 'OPERATIONS_DATE_FILTER', dateFilter);
                    libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
                    return libOpMobile.isAnyOperationStarted(context).then(() => {
                        context.getPageProxy().getClientData().OPERATIONS_FAST_FILTER_SHORT_LIST = false;
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                            SetPredefinedItemsListFilters(context, [...(IsClassicLayoutEnabled(context) ? [] : [RECEIVED]), ACCEPTED], defaultDates);
                        });
                    });
                });
            });
        }
    }
}
