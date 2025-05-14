import libCom from '../../Common/Library/CommonLibrary';
import CompleteWorkOrderMobileStatusAction from '../MobileStatus/CompleteWorkOrderMobileStatusAction';
import WorkOrderMobileStatusLibrary from '../MobileStatus/WorkOrderMobileStatusLibrary';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import OperationMobileStatusLibrary from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import generateGUID from '../../Common/guid';
import CompleteOperationMobileStatusAction from '../../Operations/MobileStatus/CompleteOperationMobileStatusAction';
import CompleteSubOperationMobileStatusAction from '../../SubOperations/MobileStatus/CompleteSubOperationMobileStatusAction';
import SubOperationMobileStatusLibrary from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import IsTimeStepVisible from '../../Operations/IsTimeStepVisible';
import RedrawCompletePage from './RedrawCompletePage';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import S4MobileStatusUpdateOverride from '../../ServiceOrders/Status/S4MobileStatusUpdateOverride';
import Logger from '../../Log/Logger';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import { IsBulkConfirmationQueueActive, RunNextBulkConfirmationAction } from '../Operations/BulkConfirmationQueue';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function FinalizeCompletePage(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    return Promise.all([IsTimeStepVisible(context), SupervisorLibrary.checkReviewRequired(context, binding)]).then((checks) => {
        let isConfirmationEnabled = checks[0];
        let isReviewRequired = checks[1];

        if (!WorkOrderCompletionLibrary.validateSteps(context)) {
            WorkOrderCompletionLibrary.setValidationMessages(context);
            RedrawCompletePage(context);
            return Promise.reject();
        } else {
            WorkOrderCompletionLibrary.resetValidationMessages(context);
            RedrawCompletePage(context);
        }

        let completeAction = Promise.resolve();
        let mobileStatus = '';

        if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
            let actions = beforeOperationComplete(context, isConfirmationEnabled, isReviewRequired);
            completeAction = getOperationCompleteAction(context);
            mobileStatus = getOperationMobileStatus(context);
            let pageContext = context;
            return Promise.all(actions).then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                    .then(() => {
                        return OperationMobileStatusLibrary.didSetOperationComplete(pageContext, mobileStatus).then(() => {
                            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                                let pdfAction = isReviewRequired ? Promise.resolve() : PDFGenerateDuringCompletion(context, binding);
                                return pdfAction.then(() => {
                                    WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);
                                    return completeAction.executeCheckWorkOrderCompleted(pageContext, completeAction).then(() => {
                                        return libAutoSync.autoSyncOnStatusChange(context);
                                    });
                                });
                            }).then(() => {
                                //Add AnalyticsManager Check here
                                AnalyticsManager.operationCompleteSuccess();
                            });
                        });
                    })
                    .catch((error) => {
                        Logger.error('Completion Failed', error);
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                    })
                    .finally(() => {
                        libCom.removeStateVariable(context, 'isAnyOperationStarted');
                        return OperationMobileStatusLibrary.isAnyOperationStarted(context);
                    });
            });
        } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
            let actions = beforeSubOperationComplete(context, isConfirmationEnabled);
            completeAction = getSubOperationCompleteAction(context);
            mobileStatus = getSubOperationMobileStatus(context);
            let pageContext = context;
            return Promise.all(actions).then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                    .then(() => {
                        return pageContext.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return SubOperationMobileStatusLibrary.didSetSubOperationCompleteWrapper(pageContext, mobileStatus).then(() => {
                                WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                                libCom.removeBindingObject(context);
                                libCom.removeStateVariable(context, 'contextMenuSwipePage');

                                return completeAction.executeCheckOperationCompleted(pageContext, completeAction).then(() => {
                                    return libAutoSync.autoSyncOnStatusChange(context);
                                });
                            });
                        }).then(() => {
                            //Add AnalyticsManager Check here
                            AnalyticsManager.suboperationCompleteSuccess();
                        });
                    })
                    .catch((error) => {
                        Logger.error('Completion Failed', error);
                        return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                    })
                    .finally(() => {
                        libCom.removeStateVariable(context, 'isAnySubOperationStarted');
                        return SubOperationMobileStatusLibrary.isAnySubOperationStarted(context);
                    });
            });
        } else if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) {
            mobileStatus = getServiceOrderMobileStatus(context);
            completeAction = getCompleteAction(context, mobileStatus, binding);
            let pageContext = context;
            return pageContext.executeAction(completeAction)
                .then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/ServiceOrderMobileStatusSuccessMessage.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return PDFGenerateDuringCompletion(context, binding).then(() => {
                                return libAutoSync.autoSyncOnStatusChange(context);
                            });
                        }).finally(() => {
                            libCom.removeStateVariable(context, 'isAnyOrderStarted');
                            S4ServiceLibrary.isAnythingStarted(context);
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                            AnalyticsManager.serviceOrderCompleteSuccess();
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                });
        } else if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) {
            mobileStatus = getServiceItemMobileStatus(context);
            completeAction = getCompleteAction(context, mobileStatus, binding);
            let pageContext = context;
            return pageContext.executeAction(completeAction)
                .then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemMobileStatusSuccessMessage.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return PDFGenerateDuringCompletion(context, binding).then(() => {
                                return libAutoSync.autoSyncOnStatusChange(context);
                            });
                        }).finally(() => {
                            libCom.removeStateVariable(context, 'IsAnyOperationStarted');
                            S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted');
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                            AnalyticsManager.serviceItemCompleteSuccess();
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                });
        } else {
            completeAction = getWOCompleteAction(context);
            mobileStatus = getWOMobileStatus(context);
            let pageContext = context;
            return completeAction.execute(pageContext)
                .then(() => {
                    return WorkOrderMobileStatusLibrary.didSetWorkOrderComplete(pageContext, mobileStatus).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            if (isReviewRequired) {
                                if (IsBulkConfirmationQueueActive(context)) {
                                    return RunNextBulkConfirmationAction(context);
                                }

                                return libAutoSync.autoSyncOnStatusChange(context);
                            } else {
                                return PDFGenerateDuringCompletion(context, binding).then(() => {
                                    if (IsBulkConfirmationQueueActive(context)) {
                                        return Promise.resolve();
                                    }
                                    return libAutoSync.autoSyncOnStatusChange(context);
                                });
                            }
                        }).finally(() => {
                            libCom.removeStateVariable(context, 'isAnyWorkOrderStarted');
                            WorkOrderMobileStatusLibrary.isAnyWorkOrderStarted(context);
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                            //Add AnalyticsManager Check here
                            AnalyticsManager.orderCompleteSuccess();
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
                });
        }
    });
}

function getWOMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OrderMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'WorkOrder');
    }

    return mobileStatus;
}

function getOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OperationMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'Operation');
    }

    return mobileStatus;
}

function getSubOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.SubOpMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'SubOperation');
    }

    return mobileStatus;
}

function getWOCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        WorkOrderId: binding.OrderId,
    };
    let action = new CompleteWorkOrderMobileStatusAction(actionArgs);

    context.getClientData().confirmationArgs = {
        doCheckWorkOrderComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

function getOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        OperationId: binding.OperationNo,
        WorkOrderId: binding.OrderId,
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckOperationComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

function beforeOperationComplete(context, isConfirmationEnabled, isReviewRequired) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];
    let isFinalConfirmation = libCom.getStateVariable(context, 'OperationFinalConfirmation');

    if ((TimeSheetsIsEnabled(context) && !isReviewRequired) || (!WorkOrderCompletionLibrary.getStepValue(context, 'time') && isConfirmationEnabled && !isReviewRequired && !isFinalConfirmation)) {
        actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
    }

    libCom.removeStateVariable(context, 'OperationFinalConfirmation');

    if (libMobile.isOperationStatusChangeable(context)) { //Handle clock out create for operation
        const odataDate = new ODataDate();
        actions.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': generateGUID(),
                    'UserGUID': libCom.getUserGuid(context),
                    'OperationNo': binding.OperationNo,
                    'OrderId': binding.OrderId,
                    'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                    'PreferenceName': binding.OrderId,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': libCom.getSapUserName(context),
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

    return actions;
}

function beforeSubOperationComplete(context, isConfirmationEnabled) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];

    if (TimeSheetsIsEnabled(context) || (!WorkOrderCompletionLibrary.getStepValue(context, 'time') && isConfirmationEnabled)) {
        actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
    }

    if (libMobile.isSubOperationStatusChangeable(context)) {
        libClock.setClockOutSubOperationODataValues(context, binding);
        actions.push(context.executeAction(
            {
                'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                    'Properties': {
                        'RecordId': generateGUID(),
                        'UserGUID': libCom.getUserGuid(context),
                        'OperationNo': binding.OperationNo,
                        'SubOperationNo': binding.SubOperationNo,
                        'OrderId': binding.OrderId,
                        'PreferenceGroup': 'END_TIME',
                        'PreferenceName': binding.OrderId,
                        'PreferenceValue': new ODataDate().toDBDateTimeString(context),
                        'UserId': libCom.getSapUserName(context),
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
            },
        ));
    }

    return actions;
}

function getSubOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        subOperation: binding,
        SubOperationId: binding.SubOperationNo,
        OperationId: binding.OperationNo,
        WorkOrderId: binding.OrderId,
        isSubOperationStatusChangeable: libMobile.isSubOperationStatusChangeable(context),
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteSubOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckSubOperationComplete: false,
        doCheckOperationComplete: false,
    };

    return action;
}

function getServiceOrderMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.MobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'S4_SRV_ORDER');
    }

    return mobileStatus;
}

function getServiceItemMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.MobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'S4_SRV_ITEM');
    }

    return mobileStatus;
}

function getCompleteAction(context, status, binding) {
    const completeMobileStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    status.MobileStatus = completeMobileStatus;
    status.Status = `${status.ObjectType}: ${completeMobileStatus}`;
    return S4MobileStatusUpdateOverride(context, binding, status);
}
