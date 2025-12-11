import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';

/**
 * Show adhoc issue button on Operation details page if the WorkOrder has a type listed in aOrderTypesToEnable
 */
export default function ZPartAdhocIssueVisible(context) {
    const unplannedOrderType = context.getGlobalDefinition('/ZDSBSSAM/Globals/ZUnplannedOrderType.global').getValue();
    const plannedOrderType = context.getGlobalDefinition('/ZDSBSSAM/Globals/ZPlannedOrderType.global').getValue();
    const aOrderTypesToEnable = [unplannedOrderType, plannedOrderType];
    let woReadLink = context.binding['@odata.readLink'] + '/WOHeader';

    return context.read('/SAPAssetManager/Services/AssetManager.service', woReadLink, [], '')
        .then(workOrder => {
            if (workOrder.getItem(0) && workOrder.getItem(0).OrderType) {
                let orderType = workOrder.getItem(0).OrderType;
                return aOrderTypesToEnable.includes(orderType);
            }
        });
}