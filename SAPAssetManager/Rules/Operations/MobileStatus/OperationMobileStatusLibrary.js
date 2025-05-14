import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import HideActionItems from '../../Common/HideActionItems';
import isTimeSheetsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import isConfirmationsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import confirmationsCreateUpdateNav from '../../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import CompleteOperationMobileStatusAction from './CompleteOperationMobileStatusAction';
import { ChecklistLibrary as libChecklist } from '../../Checklists/ChecklistLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import authorizedConfirmationCreate from '../../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import authorizedTimeSheetCreate from '../../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import isSignatureControlEnabled from '../../SignatureControl/SignatureControlViewPermission';
import libDigSig from '../../DigitalSignature/DigitalSignatureLibrary';
import checkDeviceRegistration from '../../DigitalSignature/CheckDeviceCreation';
import libSuper from '../../Supervisor/SupervisorLibrary';
import noteWrapper from '../../Supervisor/MobileStatus/NoteWrapper';
import deviceRegistration from '../../DigitalSignature/TOTPDeviceRegistration';
import IsAssignOrUnAssignEnableWorkOrderOperation from './IsAssignOrUnAssignEnableWorkOrderOperation';
import libThis from './OperationMobileStatusLibrary';
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import ODataDate from '../../Common/Date/ODataDate';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import GenerateConfirmationCounter from '../../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import GenerateLocalConfirmationNumber from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import mobileStatusEAMObjectType from '../../MobileStatus/MobileStatusEAMObjectType';
import mobileStatusHistoryEntryCreate from '../../MobileStatus/MobileStatusHistoryEntryCreate';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import generateGUID from '../../Common/guid';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import { WorkOrderOperationDetailsPageNameToOpen } from '../../WorkOrders/Operations/Details/WorkOrderOperationDetailsPageToOpen';
import SmartFormsConfirmationLibrary from '../../Forms/SmartFormsConfirmationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import sdfIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default class {

    static showTimeCaptureMessage(context, mobileStatus = undefined, isFinalRequired = false) {

        let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        let disapproveStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
        let confirm = (isConfirmationsEnabled(context) && authorizedConfirmationCreate(context));
        let timesheet = (isTimeSheetsEnabled(context) && authorizedTimeSheetCreate(context));

        if (confirm) { //Check if this operation is in review status and supervisor has time flag
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === disapproveStatus)) {
                confirm = libSuper.isSupervisorTimeEnabled(context);
            }
        } else if (timesheet) { //Check if this operation is in review status and supervisor has time flag
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === disapproveStatus)) {
                timesheet = libSuper.isSupervisorTimeEnabled(context);
            }
        }
        if (confirm) {
            return libThis.showConfirmationsCaptureMessage(context, isFinalRequired);
        } else if (timesheet) {
            return libThis.showTimeSheetCaptureMessage(context, isFinalRequired);
        }
        // Default resolve true
        return Promise.resolve(true);
    }

    static showConfirmationsCaptureMessage(context, isFinalRequired = false) {
        return libThis.showWorkOrderConfirmationMessage(context).then(didSelectOk => {
            if (!didSelectOk) {
                if (isFinalRequired) {
                    return libThis.createBlankConfirmation(context).catch(() => {
                        return Promise.resolve(true);
                    });
                } else {
                    return Promise.resolve(true);
                }
            }
            let startDate = libCommon.getStateVariable(context, 'StatusStartDate');
            let endDate = libCommon.getStateVariable(context, 'StatusEndDate');
            let binding = context.getPageProxy().getActionBinding() || libCommon.getBindingObject(context);

            let overrides = {
                'IsWorkOrderChangable': false,
                'IsOperationChangable': false,
                'OrderID': binding.OrderId,
                'WorkOrderHeader': binding.WOHeader,
                'Operation': binding.OperationNo,
                'MobileStatus': binding.MobileStatus,
                'IsFinalChangable': false,
                'Plant': binding.MainWorkCenterPlant,
                'doCheckOperationComplete': false,
                'OperationActivityType': binding.ActivityType,
            };

            if (isFinalRequired) {
                overrides.IsFinal = true;
                overrides.doCheckWorkOrderComplete = false;
            }

            return confirmationsCreateUpdateNav(context, overrides, startDate, endDate).then((result) => {
                return Promise.resolve(result);
            }, error => {
                context.dismissActivityIndicator();
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
            });
        });
    }

    static showTimeSheetCaptureMessage(context, isFinalRequired = false) {
        return libThis.showWorkOrderTimesheetMessage(context).then(bool => {
            if (bool) {
                libCommon.setOnCreateUpdateFlag(context, 'CREATE');
                return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateForWONav.action').then(function() {
                    if (libMobile.isOperationStatusChangeable(context)) {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action').then(function() {
                            return Promise.resolve(true);
                        });
                    } else {
                        return Promise.resolve();
                    }
                }, error => {
                    /**Implementing our Logger class*/
                    context.dismissActivityIndicator();
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                });
            } else {
                if (isFinalRequired) {
                    let ConfirmationNum = GenerateLocalConfirmationNumber(context);
                    let ConfirmationCounter = GenerateConfirmationCounter(context);
                    return Promise.all([ConfirmationNum, ConfirmationCounter]).then((resolvedValues) => {
                        let binding = context.getPageProxy().getActionBinding() || libCommon.getBindingObject(context);
                        let odataDate = new ODataDate();
                        let currentDate = odataDate.toDBDateString(context);
                        let currentTime = odataDate.toDBTimeString(context);
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreate.action', 'Properties': {
                                'Properties':
                                {
                                    'ConfirmationNum': resolvedValues[0],
                                    'ConfirmationCounter': resolvedValues[1],
                                    'FinalConfirmation': 'X',
                                    'OrderID': binding.OrderId,
                                    'Operation': binding.OperationNo,
                                    'SubOperation': binding.SubOperationNo || '',
                                    'StartDate': currentDate,
                                    'StartTime': currentTime,
                                    'FinishDate': currentDate,
                                    'FinishTime': currentTime,
                                    'Plant': binding.Plant || binding.MainWorkCenterPlant,

                                },
                                'Headers': {
                                    'OfflineOData.RemoveAfterUpload': true,
                                    'OfflineOData.TransactionID': resolvedValues[0],
                                },
                                'CreateLinks': [{
                                    'Property': 'WorkOrderHeader',
                                    'Target': {
                                        'EntitySet': 'MyWorkOrderHeaders',
                                        'ReadLink': `MyWorkOrderHeaders('${binding.OrderId}')`,
                                    },
                                },
                                {
                                    'Property': 'WorkOrderOperation',
                                    'Target': {
                                        'EntitySet': 'MyWorkOrderOperations',
                                        'ReadLink': `MyWorkOrderOperations(OrderId='${binding.OrderId}',OperationNo='${binding.OperationNo}')`,
                                    },
                                }],
                            },
                        }).then(() => {
                            libCommon.setStateVariable(context, 'IsFinalConfirmation', true, libCommon.getPageName(context));
                            return Promise.resolve(true);
                        }).catch(() => {
                            return Promise.resolve(true);
                        });
                    }).catch(() => {
                        return Promise.resolve(true);
                    });
                } else {
                    return Promise.resolve();
                }
            }
        }, error => {
            /**Implementing our Logger class*/
            context.dismissActivityIndicator();
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
        }).then(() => {
            if (isFinalRequired) {
                let ConfirmationNum = GenerateLocalConfirmationNumber(context);
                let ConfirmationCounter = GenerateConfirmationCounter(context);
                return Promise.all([ConfirmationNum, ConfirmationCounter]).then((resolvedValues) => {
                    let binding = context.binding;
                    let odataDate = new ODataDate();
                    let currentDate = odataDate.toDBDateString(context);
                    let currentTime = odataDate.toDBTimeString(context);
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action', 'Properties': {
                            'Properties':
                            {
                                'ConfirmationNum': resolvedValues[0],
                                'ConfirmationCounter': resolvedValues[1],
                                'FinalConfirmation': 'X',
                                'OrderID': binding.OrderId,
                                'Operation': binding.OperationNo,
                                'SubOperation': binding.SubOperationNo || '',
                                'StartDate': currentDate,
                                'StartTime': currentTime,
                                'FinishDate': currentDate,
                                'FinishTime': currentTime,
                                'Plant': binding.Plant || binding.MainWorkCenterPlant,

                            },
                            'Headers': {
                                'OfflineOData.RemoveAfterUpload': true,
                                'OfflineOData.TransactionID': resolvedValues[0],
                            },
                            'CreateLinks': [{
                                'Property': 'WorkOrderHeader',
                                'Target': {
                                    'EntitySet': 'MyWorkOrderHeaders',
                                    'ReadLink': `MyWorkOrderHeaders('${binding.OrderId}')`,
                                },
                            },
                            {
                                'Property': 'WorkOrderOperation',
                                'Target': {
                                    'EntitySet': 'MyWorkOrderOperations',
                                    'ReadLink': `MyWorkOrderOperations(OrderId='${binding.OrderId}',OperationNo='${binding.OperationNo}')`,
                                },
                            }],
                        },
                    }).then(() => {
                        libCommon.setStateVariable(context, 'IsFinalConfirmation', true, libCommon.getPageName(context));
                        return Promise.resolve(true);
                    }).catch(() => {
                        return Promise.resolve(true);
                    });
                }).catch(() => {
                    return Promise.resolve(true);
                });
            } else {
                return Promise.resolve(true);
            }
        });
    }

    static startOperation(context) {
        let binding = libCommon.getBindingObject(context);
        const opStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        return libClock.setInterimMobileStatus(context, opStarted).then(() => { //Handle clock in/out logic
            libMobile.setStartStatus(context);
            const odataDate = new ODataDate();
            libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
            const startMobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            const eamObjType = mobileStatusEAMObjectType(context);
            const properties = {
                'ObjectKey': (function() {
                    let objectKey = '';
                    //If not a local operation, it will have an ObjectKey value
                    if (binding.ObjectKey) {
                        objectKey = binding.ObjectKey;
                    } else if (binding.OperationMobileStatus_Nav.ObjectKey) {
                        //For local operations, we get the local ObjectKey from PMMobileStatuses record.
                        objectKey = binding.OperationMobileStatus_Nav.ObjectKey;
                    }
                    return objectKey;
                })(),
                'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.Operation,
                'MobileStatus': startMobileStatus,
                'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
                'CreateUserGUID': libCommon.getUserGuid(context),
                'CreateUserId': libCommon.getSapUserName(context),
            };

            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationStartUpdate.action', 'Properties': {
                    'Properties': properties,
                    'Target': {
                        'EntitySet': 'PMMobileStatuses',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': binding.OperationMobileStatus_Nav['@odata.readLink'],
                    },
                    'UpdateLinks': [{
                        'Property': 'OverallStatusCfg_Nav',
                        'Target': {
                            'EntitySet': 'EAMOverallStatusConfigs',
                            'QueryOptions': `$filter=MobileStatus eq '${startMobileStatus}' and ObjectType eq '${eamObjType}'`,
                        },
                    }],
                },
            }).then(() => {
                return mobileStatusHistoryEntryCreate(context, properties, binding.OperationMobileStatus_Nav['@odata.readLink']);
            }).then(function() {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                        'Properties': {
                            'RecordId': generateGUID(),
                            'UserGUID': libCommon.getUserGuid(context),
                            'OperationNo': binding.OperationNo,
                            'OrderId': binding.OrderId,
                            'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_IN' : 'START_TIME',
                            'PreferenceName': binding.OrderId,
                            'PreferenceValue': odataDate.toDBDateTimeString(context),
                            'UserId': libCommon.getSapUserName(context),
                        },
                        'CreateLinks': [{
                            'Property': 'WOOperation_Nav',
                            'Target':
                            {
                                'EntitySet': 'MyWorkOrderOperations',
                                'ReadLink': "MyWorkOrderOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "')",
                            },
                        }],
                    },
                }).then(() => {
                    return libClock.reloadUserTimeEntries(context).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action');
                    });
                });
            },
                () => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                });
        });
    }

    static holdOperation(context) {
        let binding = libCommon.getBindingObject(context);
        return this.showOperationHoldWarningMessage(context).then(
            result => {
                if (result) {
                    let odataDate;
                    const opHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
                    return libClock.setInterimMobileStatus(context, opHold).then(() => { //Handle clock in/out logic
                        return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/OperationMobileStatus_Nav`, [], '').then(function(results) {
                            if (results && results.getItem(0)) {
                                const status = results.getItem(0);
                                if (status) {
                                    odataDate = OffsetODataDate(context, status.EffectiveTimestamp);
                                    libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
                                }
                            }
                            odataDate = new ODataDate();
                            libCommon.setStateVariable(context, 'StatusEndDate', odataDate.date());
                            return odataDate.toDBDateTimeString(context);
                        }).then((datetime) => {
                            const holdMobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
                            const eamObjType = mobileStatusEAMObjectType(context);
                            const properties = {
                                'ObjectKey': (function() {
                                    let objectKey = '';
                                    //If not a local operation, it will have an ObjectKey value
                                    if (binding.ObjectKey) {
                                        objectKey = binding.ObjectKey;
                                    } else if (binding.OperationMobileStatus_Nav.ObjectKey) {
                                        //For local operations, we get the local ObjectKey from PMMobileStatuses record.
                                        objectKey = binding.OperationMobileStatus_Nav.ObjectKey;
                                    }
                                    return objectKey;
                                })(),
                                'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.Operation,
                                'MobileStatus': holdMobileStatus,
                                'EffectiveTimestamp': datetime,
                                'CreateUserGUID': libCommon.getUserGuid(context),
                                'CreateUserId': libCommon.getSapUserName(context),
                            };
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationHoldUpdate.action', 'Properties': {
                                    'Properties': properties,
                                    'Target': {
                                        'EntitySet': 'PMMobileStatuses',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'ReadLink': binding.OperationMobileStatus_Nav['@odata.readLink'],
                                    },
                                    'UpdateLinks': [{
                                        'Property': 'OverallStatusCfg_Nav',
                                        'Target': {
                                            'EntitySet': 'EAMOverallStatusConfigs',
                                            'QueryOptions': `$filter=MobileStatus eq '${holdMobileStatus}' and ObjectType eq '${eamObjType}'`,
                                        },
                                    }],
                                },
                            }).then(() => {
                                return mobileStatusHistoryEntryCreate(context, properties, binding.OperationMobileStatus_Nav['@odata.readLink']);
                            }).then(() => {
                                return datetime;
                            });
                        }).then(function(datetime) {
                            libMobile.setHoldStatus(context);
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                                    'Properties': {
                                        'RecordId': generateGUID(),
                                        'UserGUID': libCommon.getUserGuid(context),
                                        'OperationNo': binding.OperationNo,
                                        'OrderId': binding.OrderId,
                                        'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                                        'PreferenceName': binding.OrderId,
                                        'PreferenceValue': datetime,
                                        'UserId': libCommon.getSapUserName(context),
                                    },
                                    'CreateLinks': [{
                                        'Property': 'WOOperation_Nav',
                                        'Target':
                                        {
                                            'EntitySet': 'MyWorkOrderOperations',
                                            'ReadLink': "MyWorkOrderOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "')",
                                        },
                                    }],
                                },
                            }).then(() => {
                                return libThis.showTimeCaptureMessage(context).then(() => {
                                    return libClock.reloadUserTimeEntries(context).then(() => {
                                        context.dismissActivityIndicator();
                                        return Promise.resolve(true);
                                    });
                                });
                            });
                        },
                            () => {
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                            });
                    });
                } else {
                    return Promise.resolve();
                }
            });
    }

    static changeOperationStatusFSM(context, mobileStatus) {
        let binding = libCommon.getBindingObject(context);
        let odataDate = new ODataDate();
        let datetime = odataDate.toDBDateTimeString(context);
        const eamObjType = mobileStatusEAMObjectType(context);
        const properties = {
            'ObjectKey': (function() {
                let objectKey = '';
                //If not a local operation, it will have an ObjectKey value
                if (binding.ObjectKey) {
                    objectKey = binding.ObjectKey;
                } else if (binding.OperationMobileStatus_Nav.ObjectKey) {
                    //For local operations, we get the local ObjectKey from PMMobileStatuses record.
                    objectKey = binding.OperationMobileStatus_Nav.ObjectKey;
                }
                return objectKey;
            })(),
            'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.Operation,
            'MobileStatus': mobileStatus,
            'EffectiveTimestamp': datetime,
            'CreateUserGUID': libCommon.getUserGuid(context),
            'CreateUserId': libCommon.getSapUserName(context),
        };

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action', 'Properties': {
                'Properties': properties,
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': binding.OperationMobileStatus_Nav['@odata.readLink'],
                },
                'UpdateLinks': [{
                    'Property': 'OverallStatusCfg_Nav',
                    'Target': {
                        'EntitySet': 'EAMOverallStatusConfigs',
                        'QueryOptions': `$filter=MobileStatus eq '${mobileStatus}' and ObjectType eq '${eamObjType}'`,
                    },
                }],
            },
        }).then(() => {
            const rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            const accepted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
            const travel = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
            const onsite = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());

            if (mobileStatus === accepted) {
                libMobile.setAcceptedStatus(context);
            } else if (mobileStatus === travel) {
                libMobile.setTravelStatus(context);
            } else if (mobileStatus === onsite) {
                libMobile.setOnsiteStatus(context);
            } else if (mobileStatus === rejected) {
                libMobile.setRejectedStatus(context);
            }
            context.dismissActivityIndicator();
            return Promise.resolve(true);
        }).then(() => {
            return mobileStatusHistoryEntryCreate(context, properties, binding.OperationMobileStatus_Nav['@odata.readLink']).then(() => {
                return libAutoSync.autoSyncOnStatusChange(context);
            });
        },
            () => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
            });
    }

    static transferOperation(context) {
        if (libCommon.getWorkOrderAssignmentType(context) !== '4' && libCommon.getWorkOrderAssignmentType(context) !== 'A') {
            return this.showOperationTransferWarningMessage(context);
        } else {
            context.dismissActivityIndicator();
            return Promise.resolve();
        }
    }

    static async completeOperation(context, mobileStatus, completeFunc) {
        const binding = context.getPageProxy().getActionBinding() || libCommon.getBindingObject(context);
        context.getClientData().currentObject = binding;
        if (!completeFunc || libDigSig.isOPDigitalSignatureMandatory(context) || libDigSig.isOPDigitalSignatureOptional(context)) {
            const smartFormsCount = await SmartFormsConfirmationLibrary.countSmartFormsAssociatedWithOperation(context);
            if (smartFormsCount > 0) {
                completeFunc = SmartFormsConfirmationLibrary.openConfirmationSmartFormsPage;
            } else {
                completeFunc = this.executeCompletionStepsAfterDigitalSignature;
            }
        }
        let promises = [];
        const equipment = binding.OperationEquipment;
        const functionalLocation = binding.OperationFunctionLocation;
        return libChecklist.allowWorkOrderComplete(context, equipment, functionalLocation).then(results => { //Check for non-complete checklists and ask for confirmation
            if (results === true) {
                return libSuper.checkReviewRequired(context, binding).then(review => {
                    // Check if signature capture is required
                    if (libMobile.isOperationStatusChangeable(context)) {
                        promises.push(isSignatureControlEnabled(context, mobileStatus));
                    }
                    if (sdfIsFeatureEnabled(context)) {
                        promises.push(
                            FormInstanceCount(context, true, binding['@odata.readLink']).then((count) => {
                                if (count !== 0) {
                                    let message = context.localizeText('sdf_mandatory_forms_required');
                                    return libCommon.showErrorDialog(context, message);
                                } else {
                                    return Promise.resolve();
                                }
                            }).catch((error) => {
                                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), error);
                                return Promise.reject();
                            }));
                    }
                    return Promise.all(promises).then(() => {
                        return this.processDigitalSignatureIfNeeded(context, mobileStatus, review, completeFunc, binding).catch(() => {
                            return Promise.reject();
                        });
                    }).catch(() => {
                        return Promise.reject();
                    });
                });
            } else {
                return Promise.reject(); // Reject to force a mobile status rollback
            }
        });
    }

    static processDigitalSignatureIfNeeded(context, mobileStatus, review, completeFunc, actionBinding) {
        // Check if digital signature is required
        if (libDigSig.isOPDigitalSignatureEnabled(context)) {
            return checkDeviceRegistration(context).then(registered => {
                if (!registered) {
                    // Needs to register and do digital signarure
                    return deviceRegistration(context).then(() => {
                        ///Check that it was properly register again
                        return checkDeviceRegistration(context).then(deviceIsRegistered => {
                            if (deviceIsRegistered) {
                                //do digital signarure
                                return this.createDigitalSignatureAndCompleteOperation(context, mobileStatus, completeFunc).catch(() => {
                                    return Promise.reject();
                                });
                            } else {
                                return this.digitalSignatureCancelled(context, mobileStatus, completeFunc).catch(() => {
                                    return Promise.reject();
                                });
                            }
                        });
                    }).catch(() => {
                        return this.digitalSignatureCancelled(context, mobileStatus, review, completeFunc).catch(() => {
                            return Promise.reject();
                        });
                    });
                } else {
                    // Has registered, needs to do digital signature
                    return this.createDigitalSignatureAndCompleteOperation(context, mobileStatus, completeFunc).catch(() => {
                        return Promise.reject();
                    });
                }
            });
        } else {
            return completeFunc(context, mobileStatus, review, actionBinding);
        }
    }

    static createDigitalSignatureAndCompleteOperation(context, mobileStatus, completeFunc) {
        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/CreateDigitalSignatureNav.action').then(() => { // fulfilled
            return Promise.resolve();
        }, () => { // rejected
            return this.digitalSignatureCancelled(context, mobileStatus, completeFunc).catch(() => {
                return Promise.reject();
            });
        });
    }

    static digitalSignatureCancelled(context) {
        if (IsCompleteAction(context)) {
            return Promise.resolve();
        }
        // if dig sig is optional, proceed normally, else result in failure
        if (libDigSig.isOPDigitalSignatureOptional(context)) {
            return Promise.resolve();
        } else {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action').then(() => {
                return Promise.reject(); // Force mobile status rollack
            });
        }
    }

    static getPreferenceGroup(context) {
        return libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME';
    }

    static executeCompletionStepsAfterDigitalSignature(context, mobileStatus, review, actionBinding) {
        let pageContext = libMobile.getPageContext(context, WorkOrderOperationDetailsPageNameToOpen(context));
        let promises = [];
        let binding = actionBinding || libCommon.getBindingObject(context);
        let actionArgs = {
            OperationId: binding.OperationNo,
            WorkOrderId: binding.OrderId,
            isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
            isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        };
        return libWOStatus.NotificationUpdateMalfunctionEnd(context, binding.WOHeader).then(() => { //Capture malfunction end date if breakdown set
            if (!libMobile.isOperationStatusChangeable(context)) {
                review = false; //Allow confirming operation
            }
            return noteWrapper(context, review).then(() => { //Allow tech to leave note for supervisor
                return libThis.showTimeCaptureMessage(pageContext, mobileStatus, !review).then((didCreated) => { //If review is required, then we cannot pass up a final confirmation
                    // Action did execute, update UI accordingly
                    if (!didCreated) {
                        promises.push(libThis.createBlankConfirmation(context));
                    }
                    context.showActivityIndicator('');
                    if (libMobile.isOperationStatusChangeable(context)) { //Handle clock out create for operation
                        const odataDate = new ODataDate();
                        promises.push(context.executeAction({
                            'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                                'Properties': {
                                    'RecordId': generateGUID(),
                                    'UserGUID': libCommon.getUserGuid(context),
                                    'OperationNo': binding.OperationNo,
                                    'OrderId': binding.OrderId,
                                    'PreferenceGroup': this.getPreferenceGroup(context),
                                    'PreferenceName': binding.OrderId,
                                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                                    'UserId': libCommon.getSapUserName(context),
                                },
                                'CreateLinks': [{
                                    'Property': 'WOOperation_Nav',
                                    'Target':
                                    {
                                        'EntitySet': 'MyWorkOrderOperations',
                                        'ReadLink': "MyWorkOrderOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "')",
                                    },
                                }],
                            },
                        }));
                    }
                    return Promise.all(promises).then(() => {
                        actionArgs.didCreateFinalConfirmation = libCommon.getStateVariable(context, 'IsFinalConfirmation', libCommon.getPageName(context));
                        let action = new CompleteOperationMobileStatusAction(actionArgs);
                        pageContext.getClientData().confirmationArgs = {
                            doCheckOperationComplete: false,
                        };
                        // Add this action to client data for retrieval as needed
                        pageContext.getClientData().mobileStatusAction = action;
                        return action.execute(pageContext).then((result) => {
                            if (result) {
                                return libClock.reloadUserTimeEntries(context, undefined, undefined, binding).then(() => {
                                    return libThis.didSetOperationCompleteWrapper(pageContext, mobileStatus).then(() => {
                                        context.dismissActivityIndicator();
                                        return libAutoSync.autoSyncOnStatusChange(context);
                                    });
                                });
                            }
                            return false;
                        });
                    }, () => {
                        context.dismissActivityIndicator();
                        return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                    });
                });
            });
        });
    }

    static unconfirmOperation(context) {
        let pageContext = libMobile.getPageContext(context, WorkOrderOperationDetailsPageNameToOpen(context));
        let parent = this;

        return this.showUnconfirmOperationWarningMessage(context).then(
            async doMarkUnconfirm => {
                if (!doMarkUnconfirm) {
                    //User chose not to unconfirm operation
                    return '';
                }
                context.showActivityIndicator('');
                let binding = context.getPageProxy().getActionBinding() || pageContext.getBindingObject();
                if (context.constructor.name === 'SectionedTableProxy' && context.getPageProxy().getExecutedContextMenuItem()) {
                    binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
                }
                let confirmation = await context.read('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', [], `$filter=OrderID eq '${binding.OrderId}' and Operation eq '${binding.OperationNo}' and SubOperation eq '' and sap.islocal() and FinalConfirmation eq 'X'&$orderby=ConfirmationCounter desc&$top=1`).then(function(confirmationResults) {
                    if (confirmationResults && confirmationResults.getItem(0)) {
                        return confirmationResults.getItem(0);
                    }
                    return null;
                }, error => {
                    Logger.error('unconfirmOperation', error);
                });

                if (!confirmation) {
                    throw new Error('No final confirmations found for this operation');
                }

                let action = {
                    'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
                        'Target': {
                            'EntitySet': 'Confirmations',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': `$filter=OrderID eq '${binding.OrderId}' and Operation eq '${binding.OperationNo}' and ConfirmationNum eq '${confirmation?.ConfirmationNum}' and ConfirmationCounter eq '${confirmation?.ConfirmationCounter}'`,
                        },
                        'Properties': {
                            'FinalConfirmation': '',

                        },
                        'Headers': {
                            'OfflineOData.TransactionID': confirmation?.ConfirmationNum,
                        },
                    },
                };

                // Add this action to client data for retrieval as needed
                pageContext.getClientData().mobileStatusAction = action;

                return context.executeAction(action).then(() => {
                    return parent.didSetOperationUnconfirm(pageContext).then(() => {
                        context.dismissActivityIndicator();
                        return libAutoSync.autoSyncOnStatusChange(context);
                    });
                }, (error) => {
                    libThis.unconfirmOperationFailed(pageContext, error);
                });

            },
        ).catch(error => {
            libThis.unconfirmOperationFailed(pageContext, error);
        });
    }

    static unconfirmOperationFailed(context, error) {
        Logger.error('unconfirmOperation', error);
        context.dismissActivityIndicator();
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationUnconfirmFailureMessage.action');
    }

    static didSetOperationCompleteWrapper(context, mobileStatus) {
        if (libMobile.isOperationStatusChangeable(context)) {
            return this.didSetOperationComplete(context, mobileStatus);
        } else if (libMobile.isHeaderStatusChangeable(context)) {
            return this.didSetOperationConfirm(context);
        } else {
            return Promise.resolve();
        }
    }

    static didSetOperationComplete(context, mobileStatus) {  //Update screen toolbar after complete or review
        return libSuper.checkReviewRequired(context, context.binding).then(review => {
            if (review) { //target requires review for technician user
                libMobile.setReviewStatus(context);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action');
            }

            if (!libCommon.getStateVariable(context, 'contextMenuSwipePage')) { //only do this if not from context menu
                // Hide the action items
                HideActionItems(context, 2);
            }

            libMobile.setCompleteStatus(context);
            let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            let disapproveStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === disapproveStatus)) {
                let clientData = context.getClientData();
                clientData.ChangeStatus = 'APPROVED';
            }
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action');
        });
    }

    // Called after the operation has been set to rejected
    static didSetOperationRejected(context) {
        libMobile.setRejectedStatus(context);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action');
    }

    // Called after the operation has been set to rejected
    static didSetServiceItemRejected(context) {
        libMobile.setRejectedStatus(context);
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemMobileStatusSuccessMessage.action');
    }

    // Called after the operation has been set to disapproved by a supervisor
    static didSetOperationDisapproved(context) {
        libMobile.setDisapprovedStatus(context);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action');
    }

    static didSetOperationConfirm(context) {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationConfirmSuccessMessage.action')
            .then(() => {
                ToolbarRefresh(context);
                return Promise.resolve();
            });
    }

    static didSetOperationUnconfirm(context) {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationUnconfirmSuccessMessage.action').then(() => {
            ToolbarRefresh(context);
            return Promise.resolve();
        });
    }

    static operationStatusPopoverMenu(context) {

        let parent = this;
        let started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

        //Change operation status when assignment type is at work order header level.
        if (libMobile.isHeaderStatusChangeable(context)) {
            let workOrderMobileStatus = libMobile.getMobileStatus(context.binding.WOHeader, context);
            if (workOrderMobileStatus === started) {
                return libMobile.isMobileStatusConfirmed(context).then(result => {
                    if (result) {
                        return this.unconfirmOperation(context);
                    } else {
                        return this.completeOperation(context);
                    }
                });
            }
            context.dismissActivityIndicator();
            return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        }

        //Return the appropriate pop-over operation statuses when assignment type is at operation level.
        if (libMobile.isOperationStatusChangeable(context)) {
            let received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
            let hold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            let review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            let disapprove = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
            let mobileStatus = libMobile.getMobileStatus(context.binding, context);

            if (libClock.isBusinessObjectClockedIn(context)) {
                context.dismissActivityIndicator();
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationChangeStausStartPopover.action');
            } else {
                if (mobileStatus === received || mobileStatus === hold) {
                    //This operation is not started. It is currently either on hold or received status.
                    let isAnyOtherOperationStartedPromise = this.isAnyOperationStarted(context);
                    return isAnyOtherOperationStartedPromise.then(
                        isAnyOtherOperationStarted => {
                            if (isAnyOtherOperationStarted) {
                                let pageContext = libMobile.getPageContext(context, WorkOrderOperationDetailsPageNameToOpen(context));
                                return IsAssignOrUnAssignEnableWorkOrderOperation(context).then(function(result) {
                                    if (result) {
                                        context.dismissActivityIndicator();
                                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationChangeStatusTransferPopover.action');
                                    }
                                    return libThis.transferOperation(pageContext);
                                });
                            } else if (mobileStatus === received) {
                                context.dismissActivityIndicator();
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationChangeStausReceivePopover.action');
                            } else if (mobileStatus === hold) {
                                context.dismissActivityIndicator();
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationChangeStausHoldPopover.action');
                            } else {
                                context.dismissActivityIndicator();
                                return Promise.resolve('');
                            }
                        },
                    );
                } else if (mobileStatus === started) {
                    context.dismissActivityIndicator();
                    if (libClock.isCICOEnabled(context)) { //Handle clock in/out feature
                        if (context.binding.ClockSapUserName && context.binding.ClockSapUserName === libCommon.getSapUserName(context)) {
                            //This op was started by current user
                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationChangeStausStartPopover.action');
                        } else {
                            //This op was started by someone else, so clock current user in and adjust mobile status
                            return parent.startOperation(context);
                        }
                    } else {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationChangeStausStartPopover.action');
                    }
                } else if (mobileStatus === review) {
                    context.dismissActivityIndicator();
                    return libSuper.isUserSupervisor(context).then(isSupervisor => {
                        if (isSupervisor) { //Supervisor can approve or reject the technician's work
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/MobileStatus/OperationSupervisorReviewPopover.action');
                        }
                        //Tech user can restart a review status operation that has not yet been transmitted
                        if (libSuper.isSupervisorFeatureEnabled(context)) {
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/MobileStatus/OperationTechnicianReviewPopover.action');
                        }
                        return false; //Feature is not enabled, so do nothing
                    });
                } else if (mobileStatus === disapprove) {
                    context.dismissActivityIndicator();
                    return libSuper.isUserSupervisor(context).then(isSupervisor => {
                        if (isSupervisor) { //Supervisor can approve or reject the technician's work
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/MobileStatus/OperationSupervisorRejectedPopover.action');
                        }
                        //Tech user can restart a rejected status operation to correct it
                        if (libSuper.isSupervisorFeatureEnabled(context)) {
                            let isAnyOtherOperationStartedPromise = this.isAnyOperationStarted(context);
                            return isAnyOtherOperationStartedPromise.then(isAnyOtherOperationStarted => {
                                if (isAnyOtherOperationStarted) {
                                    let pageContext = libMobile.getPageContext(context, WorkOrderOperationDetailsPageNameToOpen(context));
                                    return this.transferOperation(pageContext);
                                }
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationChangeStausReceivePopover.action');
                            });
                        }
                        return false; //Feature is not enabled, so do nothing
                    });
                }
            }
        }

        //If assignment level is at sub-operation level, then operation mobile status cannot be changed.
        if (libMobile.isSubOperationStatusChangeable(context)) {
            return context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusNotChangeable.action');
        }

        context.dismissActivityIndicator();
        return Promise.resolve('');
    }


    static showOperationTransferWarningMessage(context) {
        return libMobile.showWarningMessage(context, context.localizeText('transfer_operation_warning_message')).then(bool => {
            if (bool) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/OperationTransferNav.action').then(function() {
                    libMobile.setTransferStatus(context);
                    libCommon.SetBindingObject(context);
                });
            } else {
                return Promise.resolve(false);
            }
        });
    }

    static showOperationHoldWarningMessage(context) {
        return libMobile.showWarningMessage(context, context.localizeText('hold_operation_warning_message'));
    }

    static showOperationCompleteWarningMessage(context, mobileStatus) {
        if (libMobile.isOperationStatusChangeable(context)) {
            return libSuper.checkReviewRequired(context, context.binding).then(review => {
                if (review) {
                    return libMobile.showWarningMessage(context, context.localizeText('review_operation_warning_message'), context.localizeText('confirm_status_change'), context.localizeText('ok'), context.localizeText('cancel'));
                }
                let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
                let disapproveStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
                if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === disapproveStatus)) {
                    return libMobile.showWarningMessage(context, context.localizeText('approve_operation_warning_message'), context.localizeText('confirm_status_change'), context.localizeText('ok'), context.localizeText('cancel'));
                }
                return libMobile.showWarningMessage(context, context.localizeText('complete_operation_warning_message'));
            });
        } else {
            return libMobile.showWarningMessage(context, context.localizeText('confirm_operation_warning_message'));
        }
    }

    static showUnconfirmOperationWarningMessage(context) {
        return libMobile.showWarningMessage(context, context.localizeText('unconfirm_operation_warning_message'));
    }

    static operationRollUpMobileStatus(context, binding) {
        let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
        let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
        let status = '';
        if (!isLocal) {
            const orderID = binding.OrderId;
            let entitySet = '';

            switch (binding['@odata.type']) {
                case '#sap_mobile.MyWorkOrderOperation':
                    entitySet = 'MyWorkOrderOperations';
                    break;
                case '#sap_mobile.MyWorkOrderSubOperation':
                    entitySet = 'MyWorkOrderSubOperations';
                    break;
                case '#sap_mobile.MyWorkOrderHeader':
                    entitySet = binding['@odata.readLink'] + '/Operations';
                    break;
                default:
                    return Promise.reject(); // Invalid entity set
            }
            const started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            const hold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            const complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, ['OperationNo', 'OrderId', 'ObjectKey'], "$filter=(OrderId eq '" + orderID + "')&$orderby=OrderId")
                .then(function(results) {
                    if (results) {
                        const oprCount = results.length;
                        if (oprCount > 0) {
                            let oprStartQueryOption = '$select=ObjectKey,MobileStatus&$orderby=ObjectKey,MobileStatus&$filter=';
                            let oprHoldQueryOption = '$select=ObjectKey,MobileStatus&$orderby=ObjectKey,MobileStatus&$filter=';
                            let oprCompleteQueryOption = '$select=ObjectKey,MobileStatus&$orderby=ObjectKey,MobileStatus&$filter=';
                            for (let i = 0; i < oprCount; i++) {
                                if (i > 0) {
                                    oprStartQueryOption = oprStartQueryOption + ' or ';
                                    oprHoldQueryOption = oprHoldQueryOption + ' or ';
                                    oprCompleteQueryOption = oprCompleteQueryOption + ' or ';
                                }
                                const item = results.getItem(i);
                                oprStartQueryOption = oprStartQueryOption + "(ObjectKey eq '" + item.ObjectKey + "' and MobileStatus eq '" + started + "')";
                                oprHoldQueryOption = oprHoldQueryOption + "(ObjectKey eq '" + item.ObjectKey + "' and MobileStatus eq '" + hold + "')";
                                oprCompleteQueryOption = oprCompleteQueryOption + "(ObjectKey eq '" + item.ObjectKey + "' and MobileStatus eq '" + complete + "')";
                            }
                            return context.count('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', oprStartQueryOption)
                                .then(oprStartCount => {
                                    if (oprStartCount > 0) {
                                        return started;
                                    }
                                    return context.count('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', oprHoldQueryOption)
                                        .then(oprHoldCount => {
                                            if (oprHoldCount > 0) {
                                                return hold;
                                            }
                                            return context.count('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', oprCompleteQueryOption)
                                                .then(oprCompleteCount => {
                                                    if (oprCompleteCount === oprCount) {
                                                        return complete;
                                                    }
                                                    return Promise.resolve(libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue()));

                                                }).catch(() => {
                                                    return Promise.resolve(libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue()));
                                                });
                                        }).catch(() => {
                                            return Promise.resolve(libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue()));

                                        });
                                }).catch(() => {
                                    return Promise.resolve(libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue()));

                                });
                        }
                    }
                    return Promise.resolve(libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue()));

                });
        } else {
            status = libCommon.getAppParam(context, 'APPLICATION', 'LocalIdentifier');
        }
        return Promise.resolve(status);
    }

    static getOperationMobileStatus(context) {
        return Promise.resolve()
            .then(() => {
                const pageContext = context.evaluateTargetPathForAPI(`#Page:${WorkOrderOperationDetailsPageNameToOpen(context)}`);
                return libMobile.getMobileStatus(pageContext.binding, pageContext);
            }).catch(() => {
                if (context.constructor.name === 'SectionedTableProxy') {
                    return libMobile.getMobileStatus(context.getPageProxy().getExecutedContextMenuItem().getBinding(), context);
                }
                return Promise.reject('');
            });
    }

    static isOperationComplete(context) {
        let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        return this.getOperationMobileStatus(context).then(status => {
            return status === completed;
        });
    }

    static showWorkOrderConfirmationMessage(context) {
        let message = context.localizeText('confirmations_add_time_message');
        return libMobile.showWarningMessage(context, message);
    }

    static showWorkOrderTimesheetMessage(context) {
        let message = context.localizeText('workorder_add_timesheet_message');
        return libMobile.showWarningMessage(context, message);
    }

    static getStartedOperationsQueryOptions(context) {
        const userId = libCommon.getSapUserName(context);
        let startedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        let queryOption = "$expand=OperationMobileStatus_Nav&$filter=OperationMobileStatus_Nav/MobileStatus eq '" + startedStatus + "'";
        if (libClock.isCICOEnabled(context) || IsPhaseModelEnabled(context)) {
            queryOption += " and OperationMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find operations that we started
        }
        if (EnableFieldServiceTechnician(context)) {
            return WorkOrderOperationsFSMQueryOption(context).then(fsmOrderTypes => {
                if (fsmOrderTypes) {
                    queryOption += ' and ' + fsmOrderTypes; // if we are on FST persona we want to check only service orders
                }
                return queryOption;
            });
        } else {
            return Promise.resolve(queryOption);
        }
    }

    /**
     * Checks to see if at least one operation has been started from all of the operations of the work order.
     * Returns a Promise whose value is true if at least one operation is in started status and false otherwise.
     * Also, sets state variable 'isAnyOperationStarted' with the same value.
     *
     * @param {*} context MDKPage context whose binding object is an operation.
     */
    static isAnyOperationStarted(context) {
        let isAnyOperationStarted = libCommon.getStateVariable(context, 'isAnyOperationStarted');
        
        if (libVal.evalIsEmpty(isAnyOperationStarted)) { //only look this up if the variable hasn't been set
            return this.getStartedOperationsQueryOptions(context).then(queryOption => {
                isAnyOperationStarted = false;
                // Only get sibling operations, not all operations.
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOption)).then(
                    startedOperationsList => {
                        if (startedOperationsList) {
                            const total = startedOperationsList.length;
                            if (total > 0) {
                                isAnyOperationStarted = true;
                            }
                        }
                        if (!isAnyOperationStarted) {
                            return libClock.isUserClockedIn(context).then(clockedIn => { //Check if user is clocked in
                                if (clockedIn) {
                                    isAnyOperationStarted = true;
                                }
                                libCommon.setStateVariable(context, 'isAnyOperationStarted', isAnyOperationStarted);
                                return isAnyOperationStarted;
                            });
                        } else {
                            libCommon.setStateVariable(context, 'isAnyOperationStarted', isAnyOperationStarted);
                            return isAnyOperationStarted;
                        }
                    },
                    error => {
                        // Implementing our Logger class
                        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                    });
            });
        }

        return Promise.resolve(isAnyOperationStarted);
    }

    static createBlankConfirmation(context, sOffset = 0, item = undefined) {
        let ConfirmationNum = GenerateLocalConfirmationNumber(context, sOffset);
        let ConfirmationCounter = GenerateConfirmationCounter(context, item);

        return Promise.all([ConfirmationNum, ConfirmationCounter]).then((resolvedValues) => {
            let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context) || context?.getPageProxy()?.getActionBinding();
            if (item) {
                binding = item;
            }
            let odataDate = new ODataDate();
            let currentDate = odataDate.toDBDateString(context);
            let currentTime = odataDate.toDBTimeString(context);
            let operationNo = binding.OperationNo || context.getClientData()?.confirmationArgs?.Operation;
            if (!operationNo) { //Object card confirm
                binding = context?.getPageProxy()?.getActionBinding() || libCommon.getBindingObject(context);
                operationNo = binding.OperationNo || context.getClientData()?.confirmationArgs?.Operation;
            }

            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action', 'Properties': {
                    'Properties':
                    {
                        'ConfirmationNum': resolvedValues[0],
                        'ConfirmationCounter': resolvedValues[1],
                        'FinalConfirmation': 'X',
                        'OrderID': binding.OrderId,
                        'Operation': operationNo,
                        'SubOperation': binding.SubOperationNo || '',
                        'StartDate': currentDate,
                        'StartTime': currentTime,
                        'FinishDate': currentDate,
                        'FinishTime': currentTime,
                        'Plant': binding.Plant || binding.MainWorkCenterPlant,

                    },
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                        'OfflineOData.TransactionID': resolvedValues[0],
                    },
                    'CreateLinks': [{
                        'Property': 'WorkOrderHeader',
                        'Target': {
                            'EntitySet': 'MyWorkOrderHeaders',
                            'ReadLink': `MyWorkOrderHeaders('${binding.OrderId}')`,
                        },
                    },
                    {
                        'Property': 'WorkOrderOperation',
                        'Target': {
                            'EntitySet': 'MyWorkOrderOperations',
                            'ReadLink': `MyWorkOrderOperations(OrderId='${binding.OrderId}',OperationNo='${operationNo}')`,
                        },
                    }],
                },
            });
        });
    }
}
