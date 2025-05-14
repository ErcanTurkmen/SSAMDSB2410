import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from './S4ServiceLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Returning actual query options depending on current date
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateFilter(context) {
    const defaultDates = libWO.getActualDates(context);
    const RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue()); 

    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [], defaultDates).then(filter => {
            return `${filter}&$expand=Priority_Nav,MobileStatus_Nav,S4ServiceErrorMessage_Nav')&$top=3`;
        });
    } else {
        return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {	
            return WorkOrdersFSMQueryOption(context).then(types => {
                return `$expand=OrderMobileStatus_Nav,WOPriority&$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}'
                    or OrderMobileStatus_Nav/MobileStatus eq '${COMPLETED}' or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'
                    or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}') and ${dateFilter} and ${types}&$top=2`;
                });
            });
    }
}
