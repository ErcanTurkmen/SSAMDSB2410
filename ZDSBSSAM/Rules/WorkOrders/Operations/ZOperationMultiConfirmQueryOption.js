import isPlannedWO from '../ZIsPlannedWorkOrderType';
import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
//import isUnPlannedWO from '../IsUnPlannedWorkOrderType';

//Confirmation enabled for operation not 0010 and ones not already confirmed
//only difference between visble and enable rule - we need to have the button visible even if it is completed
export default function ZOperationMultiConfirmQueryOption(context) {
	const operation0010 = "0010";
	let query = '';
	let orderType = context.binding?.OrderType;
	let isPlannedWorkorder = isPlannedWO(context.binding);
	let PMA = context.binding?.MaintenanceActivityType;
	const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
	// //let isUnPlannedWorkorder= isUnPlannedWO(context);
	// let fieldKey = context.binding?.FieldKey;
	// fieldKey = fieldKey.toUpperCase();
	// let zTimeRegKey = context.binding?.ZTimeRegKey;
	// zTimeRegKey = zTimeRegKey.toUpperCase();
	Logger.error("poonam ZOperationMultiConfirmQueryOption");
	if (isPlannedWorkorder) {
		query = `OperationNo ne '0010' and FieldKey ne 'OVERSKR' and ZTimeRegKey ne 'X'`;	//and op/OperationMobileStatus_Nav/MobileStatus ne '${COMPLETE}'
		Logger.error("poonam ZOperationMultiConfirmQueryOption query", query);
		return query;
	}

	if (!isPlannedWorkorder && orderType === 'SO13' && (PMA ==='288'||  PMA ==='295') ) {
		query = `OperationNo ne '0010' and ZTimeRegKey ne 'X'`;
		Logger.error("poonam ZOperationMultiConfirmQueryOption unplanned query", query);
		return query;
	}
	else {
		Logger.error("poonam ZOperationMultiConfirmQueryOption else query", query);
		return query;
	}
}