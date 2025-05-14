import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import { OperationLibrary } from './WorkOrderOperationLibrary';

export default function OperationsToSelectCount(context) {
	if (libCommon.getStateVariable(context, 'OperationsToSelectCount') !== undefined) {
		return Promise.resolve(libCommon.getStateVariable(context, 'OperationsToSelectCount'));
	}

	const COMPLETE = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
	const HOLD = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
	const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
	const REVIEW = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());

	let entitySet = 'MyWorkOrderOperations';
	let query = "$filter=Confirmations/all(wp : wp/FinalConfirmation ne 'X')";

	if (MobileStatusLibrary.isHeaderStatusChangeable(context) && context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
		entitySet = context.binding['@odata.readLink'] + '/Operations';
	}

	if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
		query += ' and ' + OperationLibrary.getOperationsFilterByAssignmentType(context);
		query += `and OperationMobileStatus_Nav/MobileStatus ne '${COMPLETE}' and OperationMobileStatus_Nav/MobileStatus ne '${REVIEW}'`;
		let unassignedFilter = "PersonNum eq '00000000' or PersonNum eq '' or PersonNum eq null";
		const persNum = libCommon.getPersonnelNumber();
		const workedByMe = `((OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}') and OperationMobileStatus_Nav/CreateUserGUID eq '${libCommon.getUserGuid(context)}')`;
		if (persNum) {
			query += ` and (${unassignedFilter} or PersonNum eq '${persNum}' or WOHeader/WOPartners/any(wp : wp/PersonNum eq '${persNum}') or ${workedByMe})`;
		} else {
			query += ` and (${unassignedFilter} or ${workedByMe})`;
		}
	}

	return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, query).then(result => {
		libCommon.setStateVariable(context, 'OperationsToSelectCount', result);
		return result;
	}).catch((error) => {
		Logger.error(error);
		return 0;
	});
}
