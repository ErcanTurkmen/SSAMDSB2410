import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Getting count of all current day Service Orders
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateFilter(context) {
    const defaultDates = libWO.getActualDates(context);

    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4ServiceLibrary.countOrdersByDateAndStatus(context, [], defaultDates);
    } else {
        return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                let options = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=${dateFilter} and ${types}`;
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, options));
            }); 
        });
    }
}
