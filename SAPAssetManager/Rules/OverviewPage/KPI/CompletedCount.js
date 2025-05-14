import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Work orders, Operations or Sub-Operations in COMPLETED status
* @param {IClientAPI} context
*/
export default function CompletedCount(context) {
    const statuses = [
        CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue()),
    ];

    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, getQueryOptionsString(statuses, 'OrderMobileStatus_Nav/MobileStatus')));
    } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, getQueryOptionsString(statuses, 'OperationMobileStatus_Nav/MobileStatus')));
    } else if (MobileStatusLibrary.isSubOperationStatusChangeable(context)) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', getQueryOptionsString(statuses, 'SubOpMobileStatus_Nav/MobileStatus'));
    } else {
        return '0';
    }
}

/**
 * @param {string[]} statuses example: ['Completed', 'Transfer']
 * @param {string} filterProp example: 'OrderMobileStatus_Nav/MobileStatus'
 * @returns {string} example: "$filter=OrderMobileStatus_Nav/MobileStatus eq 'Completed' or OrderMobileStatus_Nav/MobileStatus eq 'Transfer'"
 */
function getQueryOptionsString(statuses, filterProp) {
    const filterTerm = statuses.map(s => `${filterProp} eq '${s}'`).join(' or ');
    return `$filter=${filterTerm}`;
}
