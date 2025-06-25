import Logger from '../../../../SAPAssetManager/Rules/Log/Logger'; 
/**
 * check if operder is s013 and for the operation notification does not exists. Only then we can add new notification
 */
export default function ZCheckOperationNotificationExists(clientAPI) {
	const aUnPlannedOrderTypes = ['SO13'];
    let binding = clientAPI.getBindingObject();
	const sOrderType = binding.WOHeader.OrderType;
	if (aUnPlannedOrderTypes.includes(sOrderType) && !binding.NotifNum) {
        return true;
    }
    else 
    return false;
}