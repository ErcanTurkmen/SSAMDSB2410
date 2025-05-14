import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrderOperationsListGetTypesQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsListGetTypesQueryOption';
import libPersona from '../../Persona/PersonaLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of all current day Service Items
* @param {IClientAPI} context
*/
export default function ServiceItemsDateFilter(context) {
    const defaultDates = libWO.getActualDates(context);

    if (IsS4ServiceIntegrationEnabled(context)) {
        let categoryFilterQuery = S4ServiceLibrary.itemsServiceItemTypesQuery(context);
        return S4ServiceLibrary.countItemsByDateAndStatus(context, [], defaultDates, categoryFilterQuery);
    } else {
        return WorkOrderOperationsListGetTypesQueryOption(context).then(typesQueryOptions => {
            return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
                let queryOption = (libPersona.isFieldServiceTechnician(context) && !libVal.evalIsEmpty(typesQueryOptions)) ? `$filter=${dateFilter} and ${typesQueryOptions}` : `$filter=${dateFilter}`;
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOption));
            }); 
        });
    }
}
