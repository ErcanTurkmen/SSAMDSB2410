import isPlannedWO from '../ZIsPlannedWorkOrderType';

export default function ZOperationMultiSelectVisibleForOrderTypes(binding) {
	let orderType = binding?.OrderType;
	let isPlannedWorkorder = isPlannedWO(binding);
	let pma = binding.MaintenanceActivityType;

	//unplanned orders if SO13 order type then PMA should not be 288 or 295

	if (isPlannedWorkorder || (!isPlannedWorkorder && orderType === 'SO13' && (pma === '288' || pma === '295'))) {
		return true;
	}
	else {
		return false;
	}

}