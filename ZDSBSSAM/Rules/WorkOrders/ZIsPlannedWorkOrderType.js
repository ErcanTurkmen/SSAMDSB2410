import Logger from '../../../SAPAssetManager/Rules/Log/Logger'; 
/**
 * Return true if the WO/Opr order type is part of the list of order types defined here as Planned orders. This information is required for status transitions
 */
export default function ZIsPlannedWorkOrderType(clientAPI) {
	const aPlannedOrderTypes = ['SO11', 'SO22', 'SO26', 'SO12' , 'SO19' , 'SO23', 'SO16', 'SO14', 'SO15'];
	const sOrderType = clientAPI.getBindingObject().WOHeader.OrderType;
	return aPlannedOrderTypes.includes(sOrderType);
}