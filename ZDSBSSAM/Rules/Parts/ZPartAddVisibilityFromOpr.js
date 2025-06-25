import Logger from '../../../SAPAssetManager/Rules/Log/Logger';

/**
 * Don't show Add component Button on Operation details page if the WorkOrder has a type listed in aOrderTypesToDisable
 */
export default function ZPartAddVisibilityFromOpr(context) {

    const aOrderTypesToDisable = ['SO11', 'SO22', 'SO26', 'SO12', 'SO16'];
    let woReadLink = context.binding['@odata.readLink'] + '/WOHeader';

    return context.read('/SAPAssetManager/Services/AssetManager.service', woReadLink, [], '')
        .then(workOrder => {
            if (workOrder.getItem(0) && workOrder.getItem(0).OrderType) {
                let orderType = workOrder.getItem(0).OrderType;
                return !aOrderTypesToDisable.includes(orderType);
            }
        });
}