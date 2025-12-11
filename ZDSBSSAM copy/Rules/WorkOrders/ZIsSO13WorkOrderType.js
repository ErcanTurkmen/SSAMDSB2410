import Logger from '../../../SAPAssetManager/Rules/Log/Logger'; 
/**
 * Return true if the WO/Opr order type is SO13. This information is required for add operation 
 */
export default function ZIsSO13WorkOrderType(clientAPI) {
	const aUnPlannedOrderTypes = ['SO13'];
	const sOrderType = clientAPI.getBindingObject().OrderType;
	return aUnPlannedOrderTypes.includes(sOrderType);
}