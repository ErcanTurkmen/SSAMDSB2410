import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import libVal from '../../Common/Library/ValidationLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Service Orders or Operations in STARTED or HOLD status during the certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersStartedCount(context) {
    const defaultDates = libWO.getActualDates(context);
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue()); 
    const TRAVEL = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
    const ONSITE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
    
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.countOrdersByDateAndStatus(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates);
        } else if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            return S4ServiceLibrary.countItemsByDateAndStatus(context, [STARTED, HOLD, TRAVEL, ONSITE], defaultDates);
        } else {
            return '0';
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
                return WorkOrdersFSMQueryOption(context).then(types => {
                    let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}'
                    or OrderMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OrderMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                    
                    if (!libVal.evalIsEmpty(types)) {
                        queryOption += ' and ' + types;
                    }
        
                    return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders',libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOption));
                });
            });
        } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return WorkOrderOperationsFSMQueryOption(context).then(types => {
                return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
                    let queryOption = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}'
                    or OperationMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OperationMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
    
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
