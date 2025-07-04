import Logger from '../../../SAPAssetManager/Rules/Log/Logger'; 
/**
 * Return true if the WO/Opr order type is part of the list of order types defined here as UnPlanned orders. This information is required for status transitions
 */
export default function ZIsUnPlannedWorkOrderType(clientAPI) {
	const aUnPlannedOrderTypes = ['SO13', 'SO24', 'SO28'];
	const sOrderType = clientAPI.getBindingObject().WOHeader.OrderType;
	return aUnPlannedOrderTypes.includes(sOrderType);
}