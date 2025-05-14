import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Service Orders or Operations in COMPLETED status during the certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersFinishedCount(context) {
    const defaultDates = libWO.getActualDates(context);
    const COMPLETED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
          
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.countOrdersByDateAndStatus(context, [COMPLETED], defaultDates);
        } else if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            return S4ServiceLibrary.countItemsByDateAndStatus(context, [COMPLETED], defaultDates);
        } else {
            return 0;
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.statusOrdersCount(context, COMPLETED, defaultDates, 'ScheduledStartDate');
        } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return libOperations.statusOperationsCount(context, COMPLETED, defaultDates, 'SchedEarliestStartDate');
        } else {
            return 0;
        }
    }
}
