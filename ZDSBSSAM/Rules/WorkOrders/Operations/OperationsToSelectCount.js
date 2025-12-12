import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import MobileStatusLibrary from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import { OperationLibrary } from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationLibrary';
import ZOperationMultiConfirmQueryOption from './ZOperationMultiConfirmQueryOption';

export default function OperationsToSelectCount(context) {
	if (libCommon.getStateVariable(context, 'OperationsToSelectCount') !== undefined) {
		return Promise.resolve(libCommon.getStateVariable(context, 'OperationsToSelectCount'));
	}
	let query = '';
	
	const COMPLETE = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
	const HOLD = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
	const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
	const REVIEW = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
	Logger.error("Poonam query0", query);
	let entitySet = 'MyWorkOrderOperations';
	if (context.getPageProxy()?.getControl('SectionedTable')?.getSections()[0]?.getSelectionMode() === 'Multiple') {
		Logger.error("Poonam Multiple");
		let queryOptions = ZOperationMultiConfirmQueryOption(context);
		Logger.error("Poonam queryOptions", queryOptions);
        entitySet = context.binding['@odata.readLink'] + '/Operations';
		query = `$filter=Confirmations/all(wp : wp/FinalConfirmation ne 'X') and ${queryOptions}`;
	} else {
		query = "$filter=Confirmations/all(wp : wp/FinalConfirmation ne 'X')";
	}
	Logger.error("Poonam query1", query);
	if (MobileStatusLibrary.isHeaderStatusChangeable(context) && context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
		entitySet = context.binding['@odata.readLink'] + '/Operations';
	}

	if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
		query += ' and ' + OperationLibrary.getOperationsFilterByAssignmentType(context);
		query += `and OperationMobileStatus_Nav/MobileStatus ne '${COMPLETE}' and OperationMobileStatus_Nav/MobileStatus ne '${REVIEW}'`;
		Logger.error("Poonam query2", query);
		let unassignedFilter = "PersonNum eq '00000000' or PersonNum eq '' or PersonNum eq null";
		const persNum = libCommon.getPersonnelNumber();
		const workedByMe = `((OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}') and OperationMobileStatus_Nav/CreateUserGUID eq '${libCommon.getUserGuid(context)}')`;
		if (persNum) {
			query += ` and (${unassignedFilter} or PersonNum eq '${persNum}' or WOHeader/WOPartners/any(wp : wp/PersonNum eq '${persNum}') or ${workedByMe})`;
		} else {
			query += ` and (${unassignedFilter} or ${workedByMe})`;
		}
	}
	Logger.error("Poonam query3", query);
	return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, query).then(result => {
		Logger.error("Poonam result", result);
		libCommon.setStateVariable(context, 'OperationsToSelectCount', result);
		return result;
	}).catch((error) => {
		Logger.error(error);
		return 0;
	});
}