import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import isPlannedWO from '../ZIsPlannedWorkOrderType';
import isUnPlannedWO from '../ZIsUnPlannedWorkOrderType';

//status button (start/hold/complete) - issueparttbl is made visible for 
//unplanned orders if not SO13 order type
// or planned orders with key 
// and not operation 0010
//called from startPopOver action to show hold and complete
export default function ZOperationCompleteVisible(context) {
	Logger.error("Complete button visible rule");
	const aPlannedOrderTypes = ['SO11', 'SO22', 'SO26', 'SO12' , 'SO19' , 'SO23', 'SO16', 'SO14', 'SO15'];
	let binding = '';
	if (typeof context === 'object') {
		binding = context;
	}
	else {
		binding = context.binding;
	}
	const sOrderType = binding.WOHeader.OrderType;
	let isPlannedWorkorder = aPlannedOrderTypes.includes(sOrderType);
	let fieldKey = binding.FieldKey
	fieldKey = fieldKey.toUpperCase();
	let zTimeRegKey = binding.ZTimeRegKey;
	zTimeRegKey = zTimeRegKey.toUpperCase();

	let pma = binding.WOHeader.MaintenanceActivityType;
	let orderType = binding.WOHeader.OrderType;
	//enable complete button for unplanned orders and if so13 then check for timereg not set

	if ((!isPlannedWorkorder && orderType === 'SO13' && zTimeRegKey !== 'X') || (!isPlannedWorkorder && orderType !== 'SO13')) {
		return true;
	}
	return false;

}
