import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import IsPMNotificationEnabled from '../../UserFeatures/IsPMNotificationEnabled';
import IsPMWorkOrderEnabled from '../../UserFeatures/IsPMWorkOrderEnabled';

/**
* Getting count of Work orders, Operations or Sub-Operations in STARTED or HOLD status
* @param {IClientAPI} context
*/
export default function InProgressCount(context) {
    const statuses = [
        CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue()),
        CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue()),
    ];

    if (IsPMWorkOrderEnabled(context)) {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, getQueryOptionsString(statuses, 'OrderMobileStatus_Nav/MobileStatus')));
        } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, getQueryOptionsString(statuses, 'OperationMobileStatus_Nav/MobileStatus')));
        } else if (MobileStatusLibrary.isSubOperationStatusChangeable(context)) {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', getQueryOptionsString(statuses, 'SubOpMobileStatus_Nav/MobileStatus'));
        } else {
            return '0';
        }
    } else if (IsPMNotificationEnabled(context)) {
        if (MobileStatusLibrary.isNotifHeaderStatusChangeable(context)) {
            const started = statuses[0];
            let queryOptions = `$filter=NotifMobileStatus_Nav/MobileStatus eq '${started}'`;
            queryOptions = queryOptions + '&' + '$expand=NotifMobileStatus_Nav, NotifMobileStatus_Nav/OverallStatusCfg_Nav';
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', queryOptions);
        } else {
            return '0';
        }
    } else {
        return '0';
    }

}

/**
 * @param {string[]} statuses example: ['Started', 'Hold']
 * @param {string} filterProp example: 'OrderMobileStatus_Nav/MobileStatus'
 * @returns {string} example: "$filter=OrderMobileStatus_Nav/MobileStatus eq 'Started' or OrderMobileStatus_Nav/MobileStatus eq 'Hold'"
 */
function getQueryOptionsString(statuses, filterProp) {
    const filterTerm = statuses.map(s => `${filterProp} eq '${s}'`).join(' or ');
    return `$filter=${filterTerm}`;
}
