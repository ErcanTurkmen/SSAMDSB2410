import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import isPlannedWO from '../ZIsPlannedWorkOrderType';
import isUnPlannedWO from '../ZIsUnPlannedWorkOrderType';

//status button (start/hold/complete) - issueparttbl is made visible for 
//unplanned orders if not SO13 order type
	//or unplanned orders if SO13 order type then PMA should not be 288 and 295
	// if 288/295 and without timeregkey - confirm only. Start should not be seen
// or planned orders with key 
// and not operation 0010
export default function ZOperationDetailPageToolbarVisibility(context) {
	let binding = context.binding;
	let isPlannedWorkorder= isPlannedWO(context);
	let fieldKey = context.binding.FieldKey
	fieldKey = fieldKey.toUpperCase();
	let zTimeRegKey=context.binding.ZTimeRegKey;
	zTimeRegKey = zTimeRegKey.toUpperCase();
	//let returnVal = false;
	
	let pma = context.binding.WOHeader.MaintenanceActivityType;
	let orderType = context.binding.WOHeader.OrderType;
	
	//
	if(((!isPlannedWorkorder && orderType !== 'SO13')|| (!isPlannedWorkorder && orderType === 'SO13' && (pma !=='288'&& pma !=='295')) || (!isPlannedWorkorder && orderType === 'SO13' && (pma ==='288'|| pma ==='295') && zTimeRegKey === 'X') || (isPlannedWorkorder && fieldKey !== 'OVERSKR' && zTimeRegKey  === 'X')) && (context.binding.OperationNo !== '0010')){               
	//if(((!isPlannedWorkorder && orderType !== 'SO13')|| (!isPlannedWorkorder && orderType === 'SO13' &&  zTimeRegKey  === 'X') || (isPlannedWorkorder && fieldKey  !== 'OVERSKR' && zTimeRegKey  === 'X')) && (context.binding.OperationNo !== '0010')){
	
		return true;
	}
	/* Done to split the condn and to understand this better
	if (context.binding.OperationNo !== '0010')
	{
		Logger.error("Poonam 1");
		if(isPlannedWorkorder)
		{
			Logger.error("Poonam 2");
			if(isPlannedWorkorder && fieldKey !== 'OVERSKR' && zTimeRegKey  === 'X')
			{
				Logger.error("Poonam 3");
				returnVal = true;
			}
			else
			{
				Logger.error("Poonam 4");
				returnVal = false;
			}

		}
		else
		{
			Logger.error("Poonam 5");
			//check for unplanned scenarios
			if(orderType !== 'SO13')
			{
				Logger.error("Poonam 6");
				returnVal = true;
			}
			else 
			{ // ordertype not SO13
				Logger.error("Poonam 7");
				if(pma !=='288'&& pma !=='295')
				{
					
					returnVal = true;
					Logger.error("Poonam pma !=='288'|| pma !=='295'", returnVal);
				}
				else
				{ //pma is 288 or 295
					Logger.error("Poonam 8");
					if(zTimeRegKey === 'X')
					{
						returnVal = true;
						Logger.error("Poonam pma =='288'|| pma =='295' and time reg", returnVal);
					}
					else
					{
						returnVal = false;
						Logger.error("Poonam pma =='288'|| pma =='295' and No time reg", returnVal);
					}
				}


			}
		}
	}
	else //if opr 0010
	{
		Logger.error("Poonam 9");
		returnVal = false;
	}
	Logger.error("returnVal", returnVal);
	return returnVal;
	*/
}
