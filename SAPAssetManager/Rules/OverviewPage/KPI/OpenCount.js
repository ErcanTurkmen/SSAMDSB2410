import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Work orders, Operations or Sub-Operations not in STARTED or HOLD or COMPLETED or TRANSFERRED status
* @param {IClientAPI} context
*/
export default function OpenCount(context) {
    const statuses = [
        CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue()),
        CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue()),
        CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue()),
        CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue()),
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
 * @param {string[]} statuses example: ['Started', 'Hold', 'Completed', 'Transfer']
 * @param {string} filterProp example: 'OrderMobileStatus_Nav/MobileStatus'
 * @returns {string} example: "$filter=OrderMobileStatus_Nav/MobileStatus ne 'Started' and OrderMobileStatus_Nav/MobileStatus ne 'Hold' and OrderMobileStatus_Nav/MobileStatus ne 'Completed' and OrderMobileStatus_Nav/MobileStatus ne 'Transfer'"
 */
function getQueryOptionsString(statuses, filterProp) {
    const filterTerm = statuses.map(s => `${filterProp} ne '${s}'`).join(' and ');
    return `$filter=${filterTerm}`;
}
