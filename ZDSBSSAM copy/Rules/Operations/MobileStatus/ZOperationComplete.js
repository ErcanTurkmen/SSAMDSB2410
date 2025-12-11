import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import CompleteOperationMobileStatusAction from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/CompleteOperationMobileStatusAction';
import { ChecklistLibrary as libChecklist } from '../../../../SAPAssetManager/Rules/Checklists/ChecklistLibrary';
import libClock from '../../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import libWOStatus from '../../../../SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import isSignatureControlEnabled from '../../../../SAPAssetManager/Rules/SignatureControl/SignatureControlViewPermission';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import generateGUID from '../../../../SAPAssetManager/Rules/Common/guid';
import libAutoSync from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';
import libSuper from '../../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
import libOPMobile from './OperationMobileStatusLibrary';
import NotificationDetailsNav from '../../../../SAPAssetManager/Rules/Notifications/Details/NotificationDetailsNav';

//DSB customisation - to capture 0 time confirmation
export default function ZOperationComplete(context) {
    let pageContext = context;
    let binding = '';
    let pageName = libCommon.getPageName(context);
    if (typeof context.setToolbarItemCaption !== 'function') {
        pageContext = context.getPageProxy();
    }
    //let pageContext = libMobile.getPageContext(context, workOrderOperationDetailsPage);
    let parent = this;
    let promises = [];
    //const pageBinding = pageContext.getBindingObject();
    if (context.constructor.name === 'ObjectCardActionItemProxy') {
        binding = context.getPageProxy().getActionBinding();
        libCommon.setStateVariable(context.getPageProxy(), 'contextMenuSwipePage', pageName);
    }
    else {
        binding = libCommon.getBindingObject(context);
    }
    libCommon.setStateVariable(context, 'BINDINGOBJECT', binding);
    return ZCheckOperationNotificationCompletion(context).then(results => { //Check for non-complete notif
        if (results === true) {
            const equipment = binding.OperationEquipment;
            const functionalLocation = binding.OperationFunctionLocation;
            return libChecklist.allowWorkOrderComplete(context, equipment, functionalLocation).then(results => { //Check for non-complete checklists and ask for confirmation
                if (results === true) {
                    return showOperationCompleteWarningMessage(context).then(
                        doMarkComplete => {
                            if (!doMarkComplete) {
                                // User elected not to mark this operation as complete
                                return Promise.resolve(true);
                            }
                            if (libMobile.isOperationStatusChangeable(context)) {
                                promises.push(isSignatureControlEnabled(context));
                            }
                            if (context.constructor.name === 'ObjectCardActionItemProxy') {
                                pageName = libCommon.getPageName(context);
                                libCommon.setStateVariable(context.getPageProxy(), 'contextMenuSwipePage', pageName);
                            }
                            return Promise.all(promises).then(() => {
                                let actionArgs = {
                                    OperationId: binding.OperationNo,
                                    WorkOrderId: binding.OrderId,
                                    isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
                                    isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
                                };
                                return libWOStatus.NotificationUpdateMalfunctionEnd(context, binding.WOHeader).then(() => { //Capture malfunction end date if breakdown set
                                    //return parent.showTimeCaptureMessage(pageContext, true).then(() => {
                                    // Action did execute, update UI accordingly
                                    if (libMobile.isOperationStatusChangeable(context)) { //Handle clock out create for operation
                                        var odataDate = new ODataDate();
                                        promises.push(context.executeAction({
                                            'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                                                'Properties': {
                                                    'RecordId': generateGUID(),
                                                    'UserGUID': libCommon.getUserGuid(context),
                                                    'OperationNo': binding.OperationNo,
                                                    'OrderId': binding.OrderId,
                                                    'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
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
                                            }
                                        }));
                                    }
                                    return Promise.all(promises).then(() => {
                                        actionArgs.didCreateFinalConfirmation = true;
                                        let odataDate = new ODataDate();
                                        libCommon.setStateVariable(context, 'ConfirmationTime', odataDate.toDBTimeString(context));
                                        //actionArgs.didCreateFinalConfirmation = libCommon.getStateVariable(context, 'IsFinalConfirmation', libCommon.getPageName(context));
                                        let action = new CompleteOperationMobileStatusAction(actionArgs);
                                        pageContext.getClientData().confirmationArgs = {
                                            doCheckOperationComplete: false,
                                        };
                                        // Add this action to client data for retrieval as needed
                                        pageContext.getClientData().mobileStatusAction = action;
                                        return action.execute(pageContext).then((result) => {
                                            if (result) {
                                                return libClock.reloadUserTimeEntries(context).then(() => {
                                                    return libOPMobile.didSetOperationCompleteWrapper(pageContext).then(() => {
                                                        let abc = libCommon.getStateVariable(context, 'BINDINGOBJECT');
                                                        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action').then(results => {
                                                            libCommon.removeStateVariable(context, 'contextMenuSwipePage');
                                                            if (context.getType() === 'FioriToolbarItem.Type.Button') {
                                                                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                                                                    return libAutoSync.autoSyncOnStatusChange(context);
                                                                });
                                                            }
                                                            else
                                                                //return Promise.resolve(true);
                                                                return libAutoSync.autoSyncOnStatusChange(context);
                                                        });
                                                    });

                                                });
                                            }
                                            return false;
                                        });
                                    }, () => {
                                        return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                                    });
                                    // }); // return time capture message
                                });
                            });
                        });
                } else {
                    context.dismissActivityIndicator();
                    return Promise.resolve(true);
                }
            });
        }//if for notification comp check

    });//return
}

function ZCheckOperationNotificationCompletion(context) {
    // check if operation has a notification
    // if notificaiton is completed
    // Else - show the message and navigate to notif details screen
    let operBinding = libCommon.getBindingObject(context);

    if (operBinding.NotifNum) {
        let readLink = operBinding['@odata.readLink'] + '/NotifHeader_Nav';
        return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$expand=NotifMobileStatus_Nav').then(results => {
            if (results && results.length > 0) {
                let notif = results.getItem(0);
                let complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                if (notif.NotifMobileStatus_Nav.MobileStatus !== complete) {
                    context.getPageProxy().setActionBinding(notif);
                    return context.executeAction('/ZDSBSSAM/Actions/Notifications/MobileStatus/NotificationCompletePendingError.action').then(async() => {
                        context.dismissActivityIndicator();
                        await NotificationDetailsNav(context, false).then(() => {
                                context.getPageProxy().setActionBinding(operBinding);
                                return Promise.resolve();
                            });
                        // return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action').then(() => {
                        //     context.getPageProxy().setActionBinding(operBinding);
                        //     return Promise.resolve();
                        // });
                    });
                }
            }
            return Promise.resolve(true);
        });
    }
    else {
        return Promise.resolve(true);
    }

}

function showOperationCompleteWarningMessage(context, mobileStatus) {
    if (libMobile.isOperationStatusChangeable(context)) {
        return libSuper.checkReviewRequired(context, context.binding).then(review => {
            if (review) {
                return libMobile.showWarningMessage(context, context.localizeText('review_operation_warning_message'), context.localizeText('confirm_status_change'), context.localizeText('ok'), context.localizeText('cancel'));
            }
            let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            let rejectedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
                return libMobile.showWarningMessage(context, context.localizeText('approve_operation_warning_message'), context.localizeText('confirm_status_change'), context.localizeText('ok'), context.localizeText('cancel'));
            }
            return libMobile.showWarningMessage(context, context.localizeText('complete_operation_warning_message'));
        });
    } else {
        return libMobile.showWarningMessage(context, context.localizeText('confirm_operation_warning_message'));
    }
}