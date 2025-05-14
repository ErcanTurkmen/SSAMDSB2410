import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import HideActionItems from '../../Common/HideActionItems';
import isTimeSheetsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import isConfirmationsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import confirmationsCreateUpdateNav from '../../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import CompleteSubOperationMobileStatusAction from './CompleteSubOperationMobileStatusAction';
import UnconfirmSubOperationMobileStatusAction from './UnconfirmSubOperationMobileStatusAction';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import authorizedConfirmationCreate from '../../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import authorizedTimeSheetCreate from '../../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import isSignatureControlEnabled from '../../SignatureControl/SignatureControlViewPermission';
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import ODataDate from '../../Common/Date/ODataDate';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import GenerateConfirmationCounter from '../../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import GenerateLocalConfirmationNumber from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import mobileStatusHistoryEntryCreate from '../../MobileStatus/MobileStatusHistoryEntryCreate';
import mobileStatusEAMObjectType from '../../MobileStatus/MobileStatusEAMObjectType';
import libThis from './SubOperationMobileStatusLibrary';
import SubOperationFSMQueryOption from '../SubOperationFSMQueryOption';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';
import generateGUID from '../../Common/guid';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import { SubOperationDetailsPageName } from '../SubOperationDetailsPageToOpen';
import libVal from '../../Common/Library/ValidationLibrary';
import sdfIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';

export default class {


    static showTimeCaptureMessage(context, subOperation, isFinalRequired) {

        if (isConfirmationsEnabled(context) && authorizedConfirmationCreate(context)) {
            return libThis.showConfirmationsCaptureMessage(context, subOperation, isFinalRequired);
        } else if (isTimeSheetsEnabled(context) && authorizedTimeSheetCreate(context)) {
            return libThis.showTimeSheetCaptureMessage(context, subOperation, isFinalRequired);
        }
        return Promise.resolve(true);
    }

    static showConfirmationsCaptureMessage(context, subOperation, isFinalRequired = false) {
        return libThis.showWorkOrderConfirmationMessage(context).then(didSelectOk => {
            if (!didSelectOk) {
                return isFinalRequired ? libThis._createBlankConfirmation(context, subOperation) : true;
            }
            const overrides = {
                'IsWorkOrderChangable': false,
                'IsOperationChangable': false,
                'IsSubOperationChangable': false,
                'OrderID': subOperation.OrderId,
                'WorkOrderHeader': subOperation.WorkOrderOperation.WOHeader,
                'Operation': subOperation.OperationNo,
                'SubOperation': subOperation.SubOperationNo,
                'MobileStatus': subOperation.MobileStatus,
                'WorkOrderOperation': subOperation.WorkOrderOperation,
                'IsFinalChangable': false,
                'Plant': subOperation.MainWorkCenterPlant,
                'doCheckSubOperationComplete': false,
                'doCheckOperationComplete': false,
                'doCheckWorkOrderComplete': false,
                'OperationActivityType': subOperation.ActivityType,
            };

            if (isFinalRequired) {
                overrides.IsFinal = true;
            }

            const startDate = libCommon.getStateVariable(context, 'StatusStartDate');
            const endDate = libCommon.getStateVariable(context, 'StatusEndDate');
            return confirmationsCreateUpdateNav(context, overrides, startDate, endDate).then(() => {
                return Promise.resolve(true);
            }, error => {
                context.dismissActivityIndicator();
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
            });
        });
    }

    static showTimeSheetCaptureMessage(context, subOperation, isFinalRequired = false) {
        return libThis.showWorkOrderTimesheetMessage(context).then(doSetComplete => {
            if (doSetComplete) {
                return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateForWONav.action');
            }
            return Promise.resolve();
        }, error => {
            /**Implementing our Logger class*/
            context.dismissActivityIndicator();
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
        }).then(() => isFinalRequired ? libThis._createBlankConfirmation(context, subOperation) : true);
    }

    static _createBlankConfirmation(context, subOperation) {
        return Promise.all([GenerateLocalConfirmationNumber(context), GenerateConfirmationCounter(context)]).then(([confirmationNum, confirmationCounter]) => {
            const odataDate = new ODataDate();
            const currentDate = odataDate.toDBDateString(context);
            const currentTime = odataDate.toDBTimeString(context);
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action', 'Properties': {
                    'Properties':
                    {
                        'ConfirmationNum': confirmationNum,
                        'ConfirmationCounter': confirmationCounter,
                        'FinalConfirmation': 'X',
                        'OrderID': subOperation.OrderId,
                        'Operation': subOperation.OperationNo,
                        'SubOperation': subOperation.SubOperationNo || '',
                        'StartDate': currentDate,
                        'StartTime': currentTime,
                        'FinishDate': currentDate,
                        'FinishTime': currentTime,
                        'Plant': subOperation.Plant || subOperation.MainWorkCenterPlant,

                    },
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                        'OfflineOData.TransactionID': confirmationNum,
                    },
                    'CreateLinks': [{
                        'Property': 'WorkOrderHeader',
                        'Target': {
                            'EntitySet': 'MyWorkOrderHeaders',
                            'ReadLink': `MyWorkOrderHeaders('${subOperation.OrderId}')`,
                        },
                    },
                    {
                        'Property': 'WorkOrderOperation',
                        'Target': {
                            'EntitySet': 'MyWorkOrderOperations',
                            'ReadLink': `MyWorkOrderOperations(OrderId='${subOperation.OrderId}',OperationNo='${subOperation.OperationNo}')`,
                        },
                    }],
                },
            }).then(() => {
                libCommon.setStateVariable(context, 'IsFinalConfirmation', true, libCommon.getPageName(context));
                return Promise.resolve(true);
            });
        }).catch(() => true);
    }


    static startSubOperation(context) {
        let binding = libCommon.getBindingObject(context);
        let odataDate = new ODataDate();
        const eamObjType = mobileStatusEAMObjectType(context);
        const mobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
        libMobile.setStartStatus(context);
        let properties = {
            'ObjectKey': (function() {
                let objectKey = '';
                //If not a local sub-operation, it will have an ObjectKey value
                if (binding.ObjectKey) {
                    objectKey = binding.ObjectKey;
                } else if (binding.SubOpMobileStatus_Nav.ObjectKey) {
                    //For local sub-operations, we get the local ObjectKey from PMMobileStatuses record.
                    objectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
                }
                return objectKey;
            })(),
            'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.SubOperation,
            'MobileStatus': mobileStatus,
            'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
            'CreateUserGUID': libCommon.getUserGuid(context),
            'CreateUserId': libCommon.getSapUserName(context),
        };
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusStartUpdate.action', 'Properties': {
                'Properties': properties,
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': binding.SubOpMobileStatus_Nav['@odata.readLink'],
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
            return mobileStatusHistoryEntryCreate(context, properties, binding.SubOpMobileStatus_Nav['@odata.readLink']);
        }).then(function() {

            //Handle clock in create for sub-operation
            libClock.setClockInSubOperationODataValues(context);
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                    'Properties': {
                        'RecordId': generateGUID(),
                        'UserGUID': libCommon.getUserGuid(context),
                        'OperationNo': binding.OperationNo,
                        'SubOperationNo': binding.SubOperationNo,
                        'OrderId': binding.OrderId,
                        'PreferenceGroup': 'START_TIME',
                        'PreferenceName': binding.OrderId,
                        'PreferenceValue': odataDate.toDBDateTimeString(context),
                        'UserId': libCommon.getSapUserName(context),
                    },
                    'CreateLinks': [{
                        'Property': 'WOSubOperation_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyWorkOrderSubOperations',
                            'ReadLink': "MyWorkOrderSubOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "',SubOperationNo='" + binding.SubOperationNo + "')",
                        },
                    }],
                },
            }).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusSuccessMessage.action');
            });
        });
    }

    static changeSubOperationStatusFSM(context, status) {
        let binding = libCommon.getBindingObject(context);
        let odataDate = new ODataDate();
        const eamObjType = mobileStatusEAMObjectType(context);
        const properties = {
            'ObjectKey': (function() {
                let objectKey = '';
                //If not a local sub-operation, it will have an ObjectKey value
                if (binding.ObjectKey) {
                    objectKey = binding.ObjectKey;
                } else if (binding.SubOpMobileStatus_Nav.ObjectKey) {
                    //For local sub-operations, we get the local ObjectKey from PMMobileStatuses record.
                    objectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
                }
                return objectKey;
            })(),
            'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.SubOperation,
            'MobileStatus': status,
            'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
            'CreateUserGUID': libCommon.getUserGuid(context),
            'CreateUserId': libCommon.getSapUserName(context),
        };

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action', 'Properties': {
                'Properties': properties,
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': binding.SubOpMobileStatus_Nav['@odata.readLink'],
                },
                'Headers': {
                    'OfflineOData.NonMergeable': true,
                },
                'UpdateLinks': [{
                    'Property': 'OverallStatusCfg_Nav',
                    'Target':
                    {
                        'EntitySet': 'EAMOverallStatusConfigs',
                        'QueryOptions': `$filter=MobileStatus eq '${status}' and ObjectType eq '${eamObjType}'`,
                    },
                }],
            },
        }).then(() => {
            const rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            const accepted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
            const travel = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
            const onsite = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());

            if (status === accepted) {
                libMobile.setAcceptedStatus(context);
            } else if (status === travel) {
                libMobile.setTravelStatus(context);
            } else if (status === onsite) {
                libMobile.setOnsiteStatus(context);
            } else if (status === rejected) {
                libMobile.setRejectedStatus(context);
            }
            return Promise.resolve(true);
        }).then(() => {
            return mobileStatusHistoryEntryCreate(context, properties, binding.SubOpMobileStatus_Nav['@odata.readLink']);
        }).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusSuccessMessage.action');
        }).then(() => {
            return libAutoSync.autoSyncOnStatusChange(context);
        });
    }

    static holdSubOperation(context) {
        let binding = libCommon.getBindingObject(context);
        const eamObjType = mobileStatusEAMObjectType(context);
        const mobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        return this.showSubOperationHoldWarningMessage(context).then(
            result => {
                if (result) {
                    libMobile.setHoldStatus(context);
                    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/SubOpMobileStatus_Nav`, [], '').then(results => {
                        let odataDate;
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
                        let properties = {
                            'ObjectKey': (function() {
                                let objectKey = '';
                                //If not a local sub-operation, it will have an ObjectKey value
                                if (binding.ObjectKey) {
                                    objectKey = binding.ObjectKey;
                                } else if (binding.SubOpMobileStatus_Nav.ObjectKey) {
                                    //For local sub-operations, we get the local ObjectKey from PMMobileStatuses record.
                                    objectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
                                }
                                return objectKey;
                            })(),
                            'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.SubOperation,
                            'MobileStatus': mobileStatus,
                            'EffectiveTimestamp': datetime,
                            'CreateUserGUID': libCommon.getUserGuid(context),
                            'CreateUserId': libCommon.getSapUserName(context),
                        };
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusHoldUpdate.action', 'Properties': {
                                'Properties': properties,
                                'Target': {
                                    'EntitySet': 'PMMobileStatuses',
                                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                                    'ReadLink': binding.SubOpMobileStatus_Nav['@odata.readLink'],
                                },
                                'UpdateLinks': [{
                                    'Property': 'OverallStatusCfg_Nav',
                                    'Target':
                                    {
                                        'EntitySet': 'EAMOverallStatusConfigs',
                                        'QueryOptions': `$filter=MobileStatus eq '${mobileStatus}' and ObjectType eq '${eamObjType}'`,
                                    },
                                }],
                            },
                        }).then(() => {
                            return this.isAnySubOperationStarted(context);
                        }).then(() => {
                            return mobileStatusHistoryEntryCreate(context, properties, binding.SubOpMobileStatus_Nav['@odata.readLink']);
                        }).then(() => {
                            return datetime;
                        });
                    }).then(function(datetime) {
                        //Handle clock out create for sub-operation
                        libClock.setClockOutSubOperationODataValues(context, binding);
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                                'Properties': {
                                    'RecordId': generateGUID(),
                                    'UserGUID': libCommon.getUserGuid(context),
                                    'OperationNo': binding.OperationNo,
                                    'SubOperationNo': binding.SubOperationNo,
                                    'OrderId': binding.OrderId,
                                    'PreferenceGroup': 'END_TIME',
                                    'PreferenceName': binding.OrderId,
                                    'PreferenceValue': datetime,
                                    'UserId': libCommon.getSapUserName(context),
                                },
                                'CreateLinks': [{
                                    'Property': 'WOSubOperation_Nav',
                                    'Target':
                                    {
                                        'EntitySet': 'MyWorkOrderSubOperations',
                                        'ReadLink': "MyWorkOrderSubOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "',SubOperationNo='" + binding.SubOperationNo + "')",
                                    },
                                }],
                            },
                        }).then(() => {
                            return libThis.showTimeCaptureMessage(context, binding, false);
                        });
                    });
                } else {
                    return Promise.resolve();
                }
            });
    }

    static transferSubOperation(context) {
        libMobile.setTransferStatus(context);
        return this.showSubOperationTransferWarningMessage(context);
    }

    static completeSubOperationWithoutTime(context, mobileStatus) {
        let promises = [];

        if (libMobile.isSubOperationStatusChangeable(context)) {
            promises.push(isSignatureControlEnabled(context, mobileStatus));
        }

        return Promise.all(promises).then(() => {
            return libMobile.NotificationUpdateMalfunctionEnd(context, context.binding);
        });
    }

    /** @param {MyWorkOrderSubOperation} subOperation  */
    static completeSubOperation(context, subOperation) {
        const pageProxy = context.getPageProxy();
        return this.showSubOperationCompleteWarningMessage(context).then(doSetComplete => {
            if (!doSetComplete) {
                // Return early, user elected to not complete this operation
                return true;
            }
            context.showActivityIndicator('');
            const isSubOperationStatusChangeable = libMobile.isSubOperationStatusChangeable(context);
            return (isSubOperationStatusChangeable ? isSignatureControlEnabled(context) : Promise.resolve())
                .then(() => {
                    if (sdfIsFeatureEnabled(context)) {
                        const binding = pageProxy.getActionBinding() || pageProxy.binding;
                        return FormInstanceCount(context, true, binding['@odata.readLink']).then((count) => {
                            if (count !== 0) {
                                let message = context.localizeText('sdf_mandatory_forms_required');
                                return libCommon.showErrorDialog(context, message);
                            } else {
                                return Promise.resolve();
                            }
                        }).catch((error) => {
                            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), error);
                            return Promise.reject();
                        });
                    } else {
                        return Promise.resolve();
                    }
                }).then(() => subOperation.WorkOrderOperation.WOHeader.NotificationNumber ? libWOStatus.NotificationUpdateMalfunctionEnd(context, subOperation.WorkOrderOperation.WOHeader) : '')
                .then(() => libThis.showTimeCaptureMessage(context, subOperation, true))
                .then(() => isSubOperationStatusChangeable ? libThis._suboperationCreateCICO(context, subOperation) : '')
                .then(() => libThis._suboperationCompleteStatus(context, subOperation))
                .then(() => libThis.didSetSubOperationCompleteWrapper(pageProxy))
                .then(() => libAutoSync.autoSyncOnStatusChange(context));
        })
            .catch(error => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
                pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                return Promise.reject(error);
            })
            .finally(() => {
                context.dismissActivityIndicator();
            });
    }

    /** complete an array of suboperations without signature or timeconfirmation
     *  @param {MyWorkOrderSubOperation[]} subOperations  */
    static completeSubOperations(context, subOperations) {
        const isSubOperationStatusChangeable = libMobile.isSubOperationStatusChangeable(context);
        const pageProxy = context.getPageProxy();
        return this.showSubOperationCompleteWarningMessage(context).then(doSetComplete => {
            if (!doSetComplete) {
                // Return early, user elected to not complete
                return true;
            }
            context.showActivityIndicator('');
            return subOperations.reduce((prev, subOperation) => {
                return prev
                    .then(() => subOperation.WorkOrderOperation.WOHeader.NotificationNumber ? libWOStatus.NotificationUpdateMalfunctionEnd(context, subOperation.WorkOrderOperation.WOHeader) : '')
                    .then(() => isSubOperationStatusChangeable ? libThis._suboperationCreateCICO(context, subOperation) : '')
                    .then(() => libThis._suboperationCompleteStatus(context, subOperation));
            }, Promise.resolve())
                .then(() => libThis.didSetSubOperationCompleteWrapper(pageProxy))
                .then(() => libAutoSync.autoSyncOnStatusChange(context));
        })
            .catch(error => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
                pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                return Promise.reject(error);
            })
            .finally(() => {
                context.dismissActivityIndicator();
            });
    }

    static _suboperationCompleteStatus(context, subOperation) {
        const pageProxy = context.getPageProxy();
        const actionArgs = {
            subOperation: subOperation,
            SubOperationId: subOperation.SubOperationNo,
            OperationId: subOperation.OperationNo,
            WorkOrderId: subOperation.OrderId,
            isSubOperationStatusChangeable: libMobile.isSubOperationStatusChangeable(context),
            isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
            isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        };
        actionArgs.didCreateFinalConfirmation = libCommon.getStateVariable(context, 'IsFinalConfirmation', libCommon.getPageName(context));
        const action = new CompleteSubOperationMobileStatusAction(actionArgs);
        pageProxy.getClientData().confirmationArgs = {  // subOperationDetailsPage/operationsDetailsPage with objectcards
            doCheckSubOperationComplete: false,
            doCheckOperationComplete: false,
        };
        // Add this action to client data for retrieval as needed
        pageProxy.getClientData().mobileStatusAction = action;
        return action.execute(context.getPageProxy());
    }

    static _suboperationCreateCICO(context, subOperation) { //Capture malfunction end date if breakdown set
        if (!libMobile.isSubOperationStatusChangeable(context)) {
            return undefined;
        }
        //Handle clock out create for sub-operation
        libClock.setClockOutSubOperationODataValues(context, subOperation);
        return context.executeAction(
            {
                'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action',
                'Properties': {
                    'Properties': {
                        'RecordId': generateGUID(),
                        'UserGUID': libCommon.getUserGuid(context),
                        'OperationNo': subOperation.OperationNo,
                        'SubOperationNo': subOperation.SubOperationNo,
                        'OrderId': subOperation.OrderId,
                        'PreferenceGroup': 'END_TIME',
                        'PreferenceName': subOperation.OrderId,
                        'PreferenceValue': new ODataDate().toDBDateTimeString(context),
                        'UserId': libCommon.getSapUserName(context),
                    },
                    'CreateLinks': [{
                        'Property': 'WOSubOperation_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyWorkOrderSubOperations',
                            'ReadLink': `MyWorkOrderSubOperations(OrderId='${subOperation.OrderId}',OperationNo='${subOperation.OperationNo}',SubOperationNo='${subOperation.SubOperationNo}')`,
                        },
                    }],
                },
            },
        );
    }

    /** @param {MyWorkOrderSubOperation} subOperation  */
    static unconfirmSubOperation(context, subOperation) {
        const pageProxy = context.getPageProxy();
        return this.showUnconfirmSubOperationWarningMessage(context).then(async doMarkUnconfirm => {
            if (!doMarkUnconfirm) {
                //User chose not to unconfirm operation
                return '';
            }

            context.showActivityIndicator('');

            const confirmation = await context.read('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', [], `$filter=OrderID eq '${subOperation.OrderId}' and Operation eq '${subOperation.OperationNo}' and SubOperation eq '${subOperation.SubOperationNo}' and sap.islocal() and FinalConfirmation eq 'X'&$orderby=ConfirmationCounter desc&$top=1`).then(function(confirmationResults) {
                return confirmationResults.length ? confirmationResults.getItem(0) : null;
            }, error => {
                Logger.error('unconfirmSubOperation', error);
            });

            const actionArgs = {
                subOperation: subOperation,
                OperationId: subOperation.OperationNo,
                WorkOrderId: subOperation.OrderId,
                SubOperationId: subOperation.SubOperationNo,
            };

            const action = new UnconfirmSubOperationMobileStatusAction(actionArgs);
            // Add this action to client data for retrieval as needed
            pageProxy.getClientData().mobileStatusAction = action;

            return action.execute(pageProxy)
                .then(() => {
                    if (confirmation) {
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
                                'Target': {
                                    'EntitySet': 'Confirmations',
                                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                                    'QueryOptions': `$filter=OrderID eq '${subOperation.OrderId}' and Operation eq '${subOperation.OperationNo}' and SubOperation eq '${subOperation.SubOperationNo}' and ConfirmationNum eq '${confirmation.ConfirmationNum}' and ConfirmationCounter eq '${confirmation.ConfirmationCounter}'`,
                                },
                                'Properties': {
                                    'FinalConfirmation': '',
            
                                },
                                'Headers': {
                                    'OfflineOData.TransactionID': confirmation.ConfirmationNum,
                                },
                            },
                        });
                    } else {
                        return Promise.resolve();
                    }
                })
                .then(() => libThis.didSetSubOperationUnconfirm(pageProxy))
                .then(() => libAutoSync.autoSyncOnStatusChange(context))
                .catch(() => pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationUnconfirmFailureMessage.action'))
                .finally(() => context.dismissActivityIndicator());
        });
    }

    static showUnconfirmSubOperationWarningMessage(context) {
        return libMobile.showWarningMessage(context, context.localizeText('unconfirm_suboperation_warning_message'));
    }

    static didSetSubOperationCompleteWrapper(context) {
        if (libMobile.isSubOperationStatusChangeable(context)) {
            return this.didSetSubOperationComplete(context);
        } else {
            return this.didSetSubOperationConfirm(context);
        }
    }

    static didSetSubOperationComplete(context) {
        try {
            ToolbarRefresh(context);
            HideActionItems(context, 2);
        } catch (exception) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), `action bar refresh error: ${exception}`);
        }
        libMobile.setCompleteStatus(context);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusSuccessMessage.action');
    }

    static didSetSubOperationConfirm(context) {
        //We are confirming sub op from the operation detail page, no need to refresh toolbar
        if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationConfirmSuccessMessage.action');
        }
        return ToolbarRefresh(context).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationConfirmSuccessMessage.action');
        });
    }

    static didSetSubOperationUnconfirm(context) {
        return ToolbarRefresh(context).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationUnconfirmSuccessMessage.action');
        });
    }

    static showSubOperationTransferWarningMessage(context) {
        let message = context.localizeText('transfer_suboperation');
        return libMobile.showWarningMessage(context, message).then(bool => {
            if (bool) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationTransferNav.action');
            } else {
                return Promise.resolve(false);
            }
        });
    }

    static showSubOperationCompleteWarningMessage(context) {
        if (libMobile.isSubOperationStatusChangeable(context)) {
            return libMobile.showWarningMessage(context, context.localizeText('complete_suboperation'));
        } else {
            return libMobile.showWarningMessage(context, context.localizeText('confirm_suboperation_warning_message'));
        }
    }

    static showSubOperationHoldWarningMessage(context) {
        let message = context.localizeText('hold_suboperation_warning_message');
        return libMobile.showWarningMessage(context, message);
    }

    static showWorkOrderConfirmationMessage(context) {
        let message = context.localizeText('confirmations_add_time_message');
        return libMobile.showWarningMessage(context, message);
    }

    static showWorkOrderTimesheetMessage(context) {
        let message = context.localizeText('workorder_add_timesheet_message');
        return libMobile.showWarningMessage(context, message);
    }

    static getSubOperationMobileStatus(context) {
        let pageContext = context.evaluateTargetPathForAPI(`#Page:${SubOperationDetailsPageName(context)}`);
        return new Promise((resolve, reject) => {
            try {
                resolve(libMobile.getMobileStatus(pageContext.binding, context));
            } catch (error) {
                reject('');
            }
        });
    }

    static isSubOperationComplete(context) {
        let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        return this.getSubOperationMobileStatus(context).then(status => {
            return status === completed;
        });
    }

    static getStartedSubOperationsQueryOptions(context) {
        let userGUID = libCommon.getUserGuid(context);
        let startedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        let queryOption = `$expand = SubOpMobileStatus_Nav & $filter=SubOpMobileStatus_Nav / MobileStatus eq '${startedStatus}' and SubOpMobileStatus_Nav / CreateUserGUID eq '${userGUID}'`; //Only find sub-operations that we started

        if (EnableFieldServiceTechnician(context)) {
            return SubOperationFSMQueryOption(context).then(fsmTypes => {
                if (fsmTypes) {
                    queryOption += ' and ' + fsmTypes;
                }
                return queryOption;
            });
        } else {
            return Promise.resolve(queryOption);
        }
    }

    /**
     * Checks to see if at least one sub-operation has been started from all of the sub-operations of the operation.
     * Returns a Promise whose value is true if at least one sub-operation is in started status and false otherwise.
     *
     * @param {*} context MDKPage context whose binding object is an operation.
     */
    static isAnySubOperationStarted(context) {
        let isAnySubOperationStarted = libCommon.getStateVariable(context, 'isAnySubOperationStarted');

        if (libVal.evalIsEmpty(isAnySubOperationStarted)) { //only look this up if the variable hasn't been set
            return this.getStartedSubOperationsQueryOptions(context).then(queryOption => {
                isAnySubOperationStarted = false;
                // Only get sibling sub-operations, not all sub-operations.
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', [], queryOption).then(startedSubOperationsList => {
                    isAnySubOperationStarted = startedSubOperationsList?.length > 0;
                    libCommon.setStateVariable(context, 'isAnySubOperationStarted', isAnySubOperationStarted);
                    return isAnySubOperationStarted;
                },
                    error => {
                        // Implementing our Logger class
                        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                    });
            });
        }

        return Promise.resolve(isAnySubOperationStarted);
    }
}
