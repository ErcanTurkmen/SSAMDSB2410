import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import libVal from '../../Common/Library/ValidationLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';

/**
* Getting count of Service Orders or Operations in ACCEPTED status  during a certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersAcceptedCount(context) {
    const defaultDates = libWO.getActualDates(context);
    const RECEIVED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const ACCEPTED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
    
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            const isClassicView = libComm.getPageName(context) === 'FieldServiceOverviewClassic';
            let statusArray;

            if (isClassicView) {
                statusArray = [RECEIVED, ACCEPTED]; //Classic overview
            } else {
                statusArray = [ACCEPTED]; //New overview
            }
            return S4ServiceLibrary.countOrdersByDateAndStatus(context, statusArray, defaultDates);
        } else if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            return S4ServiceLibrary.countItemsByDateAndStatus(context, [ACCEPTED], defaultDates);
        } else {
            return '0';
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
                return WorkOrdersFSMQueryOption(context).then(types => {
                    let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or OrderMobileStatus_Nav/MobileStatus eq '${ACCEPTED}') and ${dateFilter}`;
                    
                    if (!libVal.evalIsEmpty(types)) {
                        queryOption += ' and ' + types;
                    }

                    return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOption));
                });
            });
        } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return WorkOrderOperationsFSMQueryOption(context).then(types => {
                return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
                    let filterParam = IsClassicLayoutEnabled(context) ? '' : `OperationMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or `;
                    let queryOption = `$filter=(${filterParam}OperationMobileStatus_Nav/MobileStatus eq '${ACCEPTED}') and ${dateFilter}`;
                    if (!libVal.evalIsEmpty(types)) {
                        queryOption += ' and ' + types;
                    }
                    
                    return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOption));
                });
                
            });
        } else {
            return '0';
        }
    }
}
