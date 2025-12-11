import Logger from '../../../SAPAssetManager/Rules/Log/Logger'; 
/**
 * Return true if the WO/Opr order type is part of the list of order types defined here as Planned orders. This information is required for status transitions
 */
export default function ZIsPlannedWorkOrderType(binding) {
	const aPlannedOrderTypes = ['SO11', 'SO22', 'SO26', 'SO12', 'SO19', 'SO23', 'SO16', 'SO14', 'SO15'];
	let sOrderType = '';
	if (binding?.['@odata.type'] === "#sap_mobile.MyWorkOrderOperation") {
		sOrderType = binding?.WOHeader?.OrderType;
		return aPlannedOrderTypes.includes(sOrderType);
	}
	else if (binding?.['@odata.type'] === "#sap_mobile.MyWorkOrderHeader") {
		sOrderType = binding?.OrderType;
		return aPlannedOrderTypes.includes(sOrderType);
	}
	else {
		return false
	}

}