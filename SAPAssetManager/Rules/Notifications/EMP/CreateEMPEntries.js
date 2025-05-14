import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import assnType from '../../Common/Library/AssignmentType';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import MobileStatusSetReceivedObjectKey from '../../MobileStatus/MobileStatusSetReceivedObjectKey';
import CurrentTime from '../../DateTime/CurrentTime';
import CurrentDateTime from '../../DateTime/CurrentDateTime';
import MobileStatusNotificationOverallStatusConfig from '../../MobileStatus/MobileStatusNotificationOverallStatusConfig';
import GenerateLocalID from '../../Common/GenerateLocalID';
import WorkOrderOperationPersonNum from '../../WorkOrders/Operations/WorkOrderOperationPersonNum';
import AppVersionInfo from '../../UserProfile/AppVersionInfo';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export const NotificationProcessingContextType = Object.freeze({
	EmergencyWork: '01',
	MinorWork: '02',
});

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function CreateEMPEntries(context, EMPObject, actionResults = []) {
	// If invoked by MDK, EMPObject will be undefined the first time
	// Get EMPObject from state variable. If still undefined, logic will proceed normally
	if (EMPObject === undefined) {
		EMPObject = common.getStateVariable(context, 'EMP');
	}

	const notifNumber = common.getStateVariable(context, 'LocalId');
	const notifReadLink = `MyNotificationHeaders('${notifNumber}')`;
	const notifObject = common.getStateVariable(context, 'CreateNotification');
	const notifProcessingContext = notifObject.NotifProcessingContext || '';
	let promises=[];

	promises.push(MobileStatusSetReceivedObjectKey(context));
	if (IsPhaseModelEnabled(context) && !notifProcessingContext) {
		promises.push(MobileStatusNotificationOverallStatusConfig(context));
	}

	await Promise.all(promises).then(([ObjectKey, PhaseModelStatusConfig]) => {
		let mobileStatusParameter;
		let mobileStatusValue = '';
		let headerObject = {
			'OfflineOData.NonMergeable': true,
			'OfflineOData.TransactionID': ObjectKey,
		};

		let mobileStatusLinks = [
			{
				'Property': 'NotifHeader_Nav',
				'Target': {
					'EntitySet' : 'MyNotificationHeaders',
					'ReadLink': notifReadLink,
				},
			},
		];

		if (IsPhaseModelEnabled(context)) {
			if (notifProcessingContext === NotificationProcessingContextType.MinorWork) {
				mobileStatusParameter = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue();
				mobileStatusValue = common.getAppParam(context, 'MOBILESTATUS', mobileStatusParameter);
			} else if (notifProcessingContext === NotificationProcessingContextType.EmergencyWork) {
				mobileStatusParameter = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue();
				mobileStatusValue = common.getAppParam(context, 'MOBILESTATUS', mobileStatusParameter);

				mobileStatusLinks.push({
					'Property': 'OverallStatusCfg_Nav',
					'Target': {
						'EntitySet': 'EAMOverallStatusConfigs',
						'ReadLink': "EAMOverallStatusConfigs(Status='R010',EAMOverallStatusProfile='PMSP1')",
					},
				});
			} else {
				headerObject['Transaction.Ignore'] = 'true';
				headerObject['OfflineOData.RemoveAfterUpload'] = 'true';
				mobileStatusLinks.push(
					{
						'Property': 'OverallStatusCfg_Nav',
						'Target': {
							'EntitySet' : 'EAMOverallStatusConfigs',
							'ReadLink': PhaseModelStatusConfig,
						},
					},
				);
			}
		} else {
			mobileStatusParameter = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue();
			mobileStatusValue = common.getAppParam(context, 'MOBILESTATUS', mobileStatusParameter);
			mobileStatusLinks.push(
				{
					'Property': 'OverallStatusCfg_Nav',
					'Target': {
						'EntitySet' : 'EAMOverallStatusConfigs',
						'ReadLink': `EAMOverallStatusConfigs(Status='NOTIFICATION: ${mobileStatusValue}', EAMOverallStatusProfile='')`,
					},
				},
			);
		}

		let mobileStatusActionProperties = {
			'NotifNum': notifObject.NotificationNumber,
			'MobileStatus': mobileStatusValue,
			'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.Notification,
			'ObjectKey': ObjectKey,
			'EffectiveTimestamp': CurrentDateTime(context),
		};

		let currKey = Object.keys(EMPObject || {})[0];
		if (currKey) {
			// Get one of the EMPObject Keys and create a Key-Value pair out of all of its data
			let currObject = SplitReadLink(currKey);
			currObject.ConsequenceId = EMPObject[currKey].Consequence || '';
			currObject.LikelihoodId = EMPObject[currKey].Likelihood || '';
			currObject.LeadingConsequence = EMPObject[currKey].LeadingConsequence || false;

			// Remove the key from EMPObject so it is not operated on again
			delete EMPObject[currKey];

			// Run a Create action to make the new WorkRequestConsequence
			return context.executeAction({
				'Name': '/SAPAssetManager/Actions/EMP/ConsequenceCreate.action',
				'Properties': {
					'Properties': {
						'CategoryId': currObject.CategoryId,
						'ConsequenceId': currObject.ConsequenceId,
						'GroupId': currObject.GroupId,
						'LikelihoodId': currObject.LikelihoodId,
						'PrioritizationProfileId': currObject.PrioritizationProfileId,
						'LeadingConsequence': currObject.LeadingConsequence ? 'X' : '',
					},
					'CreateLinks':
					[{
						'Property': 'MyNotificationHeader_Nav',
						'Target':
						{
							'EntitySet': 'MyNotificationHeaders',
							'ReadLink': notifReadLink,
						},
					}],
				},
			}).then((actionResult) => {
				if (Object.keys(EMPObject).length > 0) {
					// Save created entity
					actionResults.push(actionResult);
					// Recursive loop case
					return CreateEMPEntries(context, EMPObject, actionResults);
				} else {
					// Recursive loop finished
					common.clearStateVariable(context, 'EMP');
					return context.executeAction({
						'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusNotificationSetInitialStatus.action',
						'Properties': {
							'Properties': mobileStatusActionProperties,
							'CreateLinks': mobileStatusLinks,
							'Headers': headerObject,
						},
					});
				}
			});
		} else {
			common.clearStateVariable(context, 'EMP');
			// EMPObject is undefined or null
			return context.executeAction({
				'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusNotificationSetInitialStatus.action',
				'Properties': {
					'Properties': mobileStatusActionProperties,
					'CreateLinks': mobileStatusLinks,
					'Headers': headerObject,
				},
			}).then((result) => {
				if (IsPhaseModelEnabled(context) && notifProcessingContext === NotificationProcessingContextType.MinorWork) {
					const started = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
					context.read('/SAPAssetManager/Services/AssetManager.service', `EAMOverallStatusConfigs(Status='NOTIFICATION: ${started}', EAMOverallStatusProfile='')`,  [], '')
						.then(statusProfiles => !ValidationLibrary.evalIsEmpty(statusProfiles) && context.executeAction(MobileStatusUpdateOverride(context, statusProfiles.getItem(0), 'NotifMobileStatus_Nav', '', {...headerObject, NotifMobileStatus_Nav: JSON.parse(result.data)})));
				}
				return result;
			});
		}
	});

	// For emergency work, create work order + operation
	if (notifProcessingContext === '01') {
		createEmergencyWork(context, notifObject, notifReadLink);
	}
}

async function createEmergencyWork(context, notifObject, notifReadLink) {
	// ----------------WORKORDER CREATE PROPERTIES---------------- //
	const OrderId = await GenerateLocalID(context, 'MyWorkOrderHeaders', 'OrderId', '00000', "$filter=startswith(OrderId, 'LOCAL') eq true&orderby=OrderId desc", 'LOCAL_W').then(LocalId => {
		common.setStateVariable(context, 'LocalWOId', LocalId);
		return LocalId;
	});
	const OpNum = await GenerateLocalID(context, 'MyWorkOrderOperations', 'OperationNo', '000', "$filter=startswith(OperationNo, 'L') eq true", 'L');
	const FLOC_MainWorkCenter = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${notifObject.HeaderFunctionLocation}')/WorkCenter_Main_Nav`, [], '').then(res => res ?
		{'ExternalID': res.getItem(0).ExternalWorkCenterId, 'InternalID': res.getItem(0).WorkCenterId} : {'ExternalID': null, 'InternalID': null}).catch(() => ({'ExternalID': null, 'InternalID': null}));
	const EQP_MainWorkCenter = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${notifObject.HeaderEquipment}')/WorkCenter_Main_Nav`, [], '').then(res => res ?
		{'ExternalID': res.getItem(0).ExternalWorkCenterId, 'InternalID': res.getItem(0).WorkCenterId} : {'ExternalID': null, 'InternalID': null}).catch(() => ({'ExternalID': null, 'InternalID': null}));
	const UserDefaultMainWorkCenter = {'ExternalID': notifObject.ExternalWorkCenterId, 'InternalID': notifObject.MainWorkCenter};

	const WorkCenterInfo = [FLOC_MainWorkCenter, EQP_MainWorkCenter, UserDefaultMainWorkCenter].find(value => {
		return value.ExternalID && value.InternalID;
	}) || {InternalID: '', ExternalID: ''};

	let createdLinks = await getCreateLinks(context, notifObject);
	let defaultWorkCenterPlant = await context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=WorkCenterId eq '${WorkCenterInfo.InternalID}' and ExternalWorkCenterId eq '${WorkCenterInfo.ExternalID}'`).then(res => {
		if (res.length > 0)
			return res.getItem(0).PlantId;
		else
			return assnType.getWorkOrderAssignmentDefaults().WorkCenterPlant.default;
	}).catch(() => assnType.getWorkOrderAssignmentDefaults().WorkCenterPlant.default);

	let woCreateProperties = {
		'OrderId': OrderId,
		'OrderDescription': notifObject.NotificationDescription,
		'PlanningPlant': notifObject.PlanningPlant,
		'Priority': notifObject.Priority,
		'HeaderFunctionLocation': notifObject.HeaderFunctionLocation,
		'HeaderEquipment': notifObject.HeaderEquipment,
		'BusinessArea': '',
		'WorkCenterInternalId': WorkCenterInfo.InternalID,
		'MainWorkCenter': WorkCenterInfo.ExternalID,
		'CreationDate': CurrentDateTime(context),
		'CreationTime': CurrentTime(context),
		'NotificationNumber': notifObject.NotificationNumber,
		'MainWorkCenterPlant': defaultWorkCenterPlant,
		'OrderProcessingContext': 'E',
		'OrderType': 'YA01',
	};

	// ----------------OPERATION CREATE PROPERTIES---------------- //
	let operationCreateProperties = {
		'OperationNo': OpNum,
		'OperationShortText': notifObject.NotificationDescription,
		'MainWorkCenterPlant': defaultWorkCenterPlant,
		'MainWorkCenter': FLOC_MainWorkCenter.ExternalID || EQP_MainWorkCenter.ExternalID || UserDefaultMainWorkCenter.ExternalID || '',
		'WorkCenterInternalId': FLOC_MainWorkCenter.InternalID || EQP_MainWorkCenter.InternalID || UserDefaultMainWorkCenter.InternalID || '',
		'PersonNum': WorkOrderOperationPersonNum(context),
	};
	let operationCreateLinks = [
		{
			'Property': 'WOHeader',
			'Target': {
				'EntitySet': 'MyWorkOrderHeaders',
				'ReadLink': 'pending_1',
			},
		},
	];
	if (notifObject.HeaderEquipment) {
		operationCreateLinks.push({
			'Property': 'EquipmentOperation',
			'Target': {
				'EntitySet': 'MyEquipments',
				'ReadLink': `MyEquipments('${notifObject.HeaderEquipment}')`,
			},
		});
	}
	if (notifObject.HeaderFunctionLocation) {
		operationCreateLinks.push({
			'Property': 'FunctionalLocationOperation',
			'Target': {
				'EntitySet': 'MyFunctionalLocations',
				'ReadLink': `MyFunctionalLocations('${notifObject.HeaderFunctionLocation}')`,
			},
		});
	}

	try {
		// ------ CREATE WORK ORDER/OPERATION ------ //
		await context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericChangeSet.action', 'Properties': {
			'Actions': [
				{
					'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 'Properties': {
						'Target': {
							'EntitySet': 'MyWorkOrderHeaders',
							'Service': '/SAPAssetManager/Services/AssetManager.service',
						},
						'Properties': woCreateProperties,
						'Headers': {
							'OfflineOData.TransactionID': OrderId,
							'OfflineOData.NonMergeable': false,
							'OfflineOData.RemoveAfterUpload': true,
							'transaction.omdo_id': `SAM${AppVersionInfo(context).split('.')[0]}_WORK_ORDER_GENERIC_EAM`,
						},
						'CreateLinks': createdLinks,
					},
				},
				{
					'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 'Properties': {
						'Target': {
							'EntitySet': 'MyWorkOrderOperations',
							'Service': '/SAPAssetManager/Services/AssetManager.service',
						},
						'Properties': operationCreateProperties,
						'Headers': {
							'transaction.omdo_id': `SAM${AppVersionInfo(context).split('.')[0]}_WORK_ORDER_GENERIC_EAM`,
							'OfflineOData.TransactionID': OrderId,
							'OfflineOData.NonMergeable': false,
						},
						'CreateLinks': operationCreateLinks,
					},
				},
			],
		}});

		await setWorkOrderReadyStatus(context, OrderId);
		await setOperationReadyStatus(context, OrderId, OpNum);
		await updateNotificationLinks(context, OrderId, notifReadLink);

		return Promise.resolve();
	} catch (exc) {
		const message = 'Work Order/Operation Create Failed';
		return context.executeAction({'Name': '/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action', 'Properties': {
			'Message': message,
		}});
	}
}

function getCreateLinks(context, createdNotif) {
	let links = [];
	return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['PriorityType'],
		`$filter=PlanningPlant eq '${createdNotif.PlanningPlant}' and OrderType eq 'YA01'`).then(orderTypes => {
		if (orderTypes.getItem(0)) {
			let priorityType = orderTypes.getItem(0).PriorityType;
			if (createdNotif.HeaderEquipment) {
				links.push({
					'Property': 'Equipment',
					'Target': {
						'EntitySet': 'MyEquipments',
						'ReadLink': `MyEquipments('${createdNotif.HeaderEquipment}')`,
					},
				});
			}
			if (createdNotif.HeaderFunctionLocation) {
				links.push({
					'Property': 'FunctionalLocation',
					'Target': {
						'EntitySet': 'MyFunctionalLocations',
						'ReadLink': `MyFunctionalLocations('${createdNotif.HeaderFunctionLocation}')`,
					},
				});
			}
			if (createdNotif.NotificationNumber) {
				links.push({
					'Property': 'Notification',
					'Target': {
						'EntitySet': 'MyNotificationHeaders',
						'ReadLink': `MyNotificationHeaders('${createdNotif.NotificationNumber}')`,
					},
				});
			}
			if (priorityType && createdNotif.Priority) {
				links.push({
					'Property': 'WOPriority',
					'Target': {
						'EntitySet': 'Priorities',
						'ReadLink': `Priorities(PriorityType='${priorityType}',Priority='${createdNotif.Priority}')`,
					},
				});
			}

			return links;
		} else {
			return [];
		}
	});
}

function setOperationReadyStatus(context, OrderId, OpNum) {
	return context.executeAction({
		'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusOperationSetReceived.action',
		'Properties': {
			'Properties': {
				'OperationNo': OpNum,
				'MobileStatus': common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReadyParameterName.global').getValue()),
			},
			'CreateLinks': [
				{
					'Property': 'WOOperation_Nav',
					'Target': {
						'EntitySet': 'MyWorkOrderOperations',
						'ReadLink': `MyWorkOrderOperations(OrderId='${OrderId}',OperationNo='${OpNum}')`,

					},
				},
				{
					'Property': 'OverallStatusCfg_Nav',
					'Target': {
						'EntitySet': 'EAMOverallStatusConfigs',
						'ReadLink': "EAMOverallStatusConfigs(Status='R125',EAMOverallStatusProfile='PMSP1')",
					},
				},
			],
			'Headers': {
				'Transaction.Ignore': true,
				'OfflineOData.RemoveAfterUpload': true,
			},
			'OnFailure': '/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action',
			'OnSuccess': '',
		},
	});
}

function setWorkOrderReadyStatus(context, OrderId) {
	return context.executeAction({
		'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusWorkOrderSetReceived.action',
		'Properties': {
			'Properties': {
				'MobileStatus': common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReadyParameterName.global').getValue()),
			},
			'CreateLinks': [
				{
					'Property': 'WOHeader_Nav',
					'Target': {
						'EntitySet': 'MyWorkOrderHeaders',
						'ReadLink': `MyWorkOrderHeaders('${OrderId}')`,

					},
				},
				{
					'Property': 'OverallStatusCfg_Nav',
					'Target': {
						'EntitySet': 'EAMOverallStatusConfigs',
						'ReadLink': "EAMOverallStatusConfigs(Status='R125',EAMOverallStatusProfile='PMSP1')",
					},
				},
			],
			'Headers': {
				'Transaction.Ignore': true,
				'OfflineOData.RemoveAfterUpload': true,
			},
			'OnFailure': '/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action',
			'OnSuccess': '',
		},
	});
}

function updateNotificationLinks(context, orderId, notifReadLink) {
	return context.executeAction({
		'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateWorkOrderId.action',
		'Properties': {
			'Properties': {
				'OrderId': orderId,
			},
			'UpdateLinks': [{
				'Property': 'WOHeader_Nav',
				'Target': {
					'EntitySet': 'MyWorkOrderHeaders',
					'ReadLink': `MyWorkOrderHeaders('${orderId}')`,
				},
			}],
			'Target': {
				'ReadLink': notifReadLink,
			},
			'Headers': {
				'OfflineOData.TransactionID': orderId,
			},
		},
	});
}
