import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Service Orders or Operations in RECEIVED status during a certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersReceivedCount(context) {
    const defaultDates = libWO.getActualDates(context);
    const RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            return S4ServiceLibrary.countItemsByDateAndStatus(context, [RECEIVED], defaultDates);
        } else if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.countOrdersByDateAndStatus(context, [RECEIVED], defaultDates);
        } else {
            return 0;
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.statusOrdersCount(context, RECEIVED, defaultDates, 'ScheduledStartDate');
        }
        if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return libOperations.statusOperationsCount(context, RECEIVED, defaultDates, 'SchedEarliestStartDate');
        } else {
            return 0;
        }
    }
}
