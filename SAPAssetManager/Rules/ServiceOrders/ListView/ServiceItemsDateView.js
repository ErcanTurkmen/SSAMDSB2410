import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Switch to WorkOrdersListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceItemsDateView(context) {
    const defaultDates = libWO.getActualDates(context);

    /** @type {import('../Item/GetListItemCaption').ServiceItemsListViewPageClientData} */
    const actionBinding = { isInitialFilterNeeded: true };

    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [], defaultDates).then(filter => {
            actionBinding.filter = filter;
            actionBinding.displayShortFastFilterItemList = true;
            context.getPageProxy().setActionBinding(actionBinding);
            return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                    SetPredefinedItemsListFilters(context, '', defaultDates);
                });
            });
        });
    } else {
        context.getPageProxy().setActionBinding(actionBinding);
        return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
            const filter = `$filter=${dateFilter}`;
            libCom.setStateVariable(context, 'OPERATIONS_DATE_FILTER', dateFilter);
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
            return libOpMobile.isAnyOperationStarted(context).then(() => {
                context.getPageProxy().getClientData().OPERATIONS_FAST_FILTER_SHORT_LIST = true;
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                    SetPredefinedItemsListFilters(context, '', defaultDates);
                });
            });
        });
    }
}
