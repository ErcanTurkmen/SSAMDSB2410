import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import isPlannedWO from '../ZIsPlannedWorkOrderType';
//import isUnPlannedWO from '../IsUnPlannedWorkOrderType';

//Confirmation enabled for operation not 0010 and ones not already confirmed
//only difference between visble and enable rule - we need to have the button visible even if it is completed
export default function ZOperationConfirmVisible(context) {
	const aPlannedOrderTypes = ['SO11', 'SO22', 'SO26', 'SO12' , 'SO19' , 'SO23', 'SO16', 'SO14', 'SO15'];
	let binding = '';
	if (typeof context === 'object') {
		binding = context;
	}
	else {
		binding = context?.binding;
	}
	const sOrderType = binding?.WOHeader.OrderType;
	let isPlannedWorkorder = aPlannedOrderTypes.includes(sOrderType);
	//let isUnPlannedWorkorder= isUnPlannedWO(context);
	let fieldKey = binding.FieldKey;
	fieldKey = fieldKey.toUpperCase();
	let zTimeRegKey = binding.ZTimeRegKey;
	zTimeRegKey = zTimeRegKey.toUpperCase();
	let pma = binding.WOHeader.MaintenanceActivityType;
	let orderType = binding.WOHeader.OrderType;
	//Enable for planned orders with no time reg key and field key
	//unplanned orders if SO13 order type then PMA should not be 288 or 295 and TimeReg not set
	
	if ((isPlannedWorkorder && fieldKey  !== 'OVERSKR' && zTimeRegKey  !== 'X') || ((!isPlannedWorkorder && orderType === 'SO13' && (pma ==='288' ||  pma ==='295') && zTimeRegKey  !== 'X')))
	{
		//return libMobile.mobileStatus(context, context.binding).then(mobileStatus => {
			if (binding.OperationNo === '0010'){ //|| mobileStatus === complete ) {
	            return false;  
	        }
	        else
			{
				return true; //confirm is true
			}
	                    
	    //});	
	}

	return false;
	
}
