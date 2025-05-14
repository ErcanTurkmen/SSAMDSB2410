import libMobile from '../../MobileStatus/MobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import HideActionItems from '../../Common/HideActionItems';
import Logger from '../../Log/Logger';
import libDigSig from '../../DigitalSignature/DigitalSignatureLibrary';
import checkDeviceRegistration from '../../DigitalSignature/CheckDeviceCreation';
import deviceRegistration from '../../DigitalSignature/TOTPDeviceRegistration';
import libThis from './NotificationMobileStatusLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import ToolbarUpdateVisibility from '../../Common/DetailsPageToolbar/ToolbarUpdateVisibility';
import { NotificationDetailsPageName } from '../Details/NotificationDetailsPageToOpen';

export default class {

    static startNotification(context) {
        const pageName = NotificationDetailsPageName(context);
        let pageContext = libMobile.getPageContext(context, pageName);
        let allTaskComplete = this.isAllTasksComplete(context);
        let allItemTaskComplete = this.isAllItemTasksComplete(context);
        return Promise.all([allTaskComplete, allItemTaskComplete]).then(values => {
            pageContext.setToolbarItemCaption('EndNotificationTbI', pageContext.localizeText('complete_notification'));
            CommonLibrary.enableToolBar(context, pageName, 'EndNotificationTbI', !!(values[0] && values[1]));
            return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationStartUpdate.action').then(
                () => {
                    libMobile.setStartStatus(pageContext);
                    return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action');
                }, (error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
                    return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
                });
        });
    }


    /**
     * Edit the breakdown start/end dates
     * @param {*} context
     */
    static NotificationUpdateMalfunctionEnd(context) {
        let binding = context.getBindingObject();
        if (context.constructor.name === 'SectionedTableProxy') {
            binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
        }

        let mobileStatusUpdateActionResult = context.getActionResult('MobileStatusUpdate');
        if (mobileStatusUpdateActionResult) {
            const mobileStatusUpdateActionResultObject = JSON.parse(mobileStatusUpdateActionResult.data);
            const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            if (mobileStatusUpdateActionResultObject.MobileStatus === COMPLETE) {
                return Promise.resolve();
            }
        }

        if (binding.BreakdownIndicator === true && !binding.MalfunctionEndDate) { //If breakdown is set and end date is not set
            if (context.constructor.name === 'SectionedTableProxy') {
                context.getPageProxy().setActionBinding(binding);
            }
            return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationUpdateMalfunctionEndNav.action');
        }
        return Promise.resolve();
    }

    static completeNotification(context, postExecute = this.executeCompletionStepsAfterDigitalSignature) {
        if (libDigSig.isNODigitalSignatureEnabled(context)) {
            // check for digital signature and device Registration
            return checkDeviceRegistration(context).then(registered => {
                if (!registered) {
                        // Needs to register and do digital signarure
                        return deviceRegistration(context).then(() => {
                            ///Check is was properly register
                            return checkDeviceRegistration(context).then(deviceIsRegistered => {
                                if (deviceIsRegistered) {
                                    //do digital signarure
                                    return this.createDigitalSignatureAndCompleteNotification(context, postExecute);
                                } else {
                                    return this.cancelDigitalSignature(context, postExecute);
                                }
                            });

                        }, () => {
                            return this.cancelDigitalSignature(context, postExecute);
                        });
                } else {
                    // Has registered, needs to do digital signature
                    return this.createDigitalSignatureAndCompleteNotification(context, postExecute);
                }
            });
        }
        return postExecute(context);
    }

    static cancelDigitalSignature(context, postExecute) {
        if (libDigSig.isNODigitalSignatureMandatory()) {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action').then(() => {
                return Promise.resolve(false);
            });
        } else {
            return postExecute(context);
        }
    }

    static createDigitalSignatureAndCompleteNotification(context, postExecute) {
        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/CreateDigitalSignatureNav.action').then( () => {
            return postExecute(context);
        }, () => {
            if (libDigSig.isNODigitalSignatureOptional(context)) {
                return postExecute(context);
            } else {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action').then(() => {
                    return Promise.reject();
                });
            }
        });
    }

    static executeCompletionStepsAfterDigitalSignature(context) {
        let pageContext = libMobile.getPageContext(context, NotificationDetailsPageName(context));
        return libThis.NotificationUpdateMalfunctionEnd(pageContext).then(() => {
            return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationCompleteUpdate.action').then(() => {
                libMobile.setCompleteStatus(pageContext);
                ToolbarUpdateVisibility(context, false);
                HideActionItems(context.getPageProxy(), 2);
                return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                    return libAutoSync.autoSyncOnStatusChange(context);
                });
            },
            (error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
                return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
            });
        });
    }

    static showNotificationCompleteWarningMessage(context) {
        let message = context.localizeText('notification_complete_warning');
        return libMobile.showWarningMessage(context, message);
    }

    static isNotificationComplete(context) {
        return new Promise((resolve, reject) => {
            try {
                this.getHeaderMobileStatus(context).then(status => {
                    const complete = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                    if (status === complete) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } catch (error) {
                reject(false);
            }
        });
    }

    static getHeaderMobileStatus(context) {
        // This request did not originate from notificationDetailsPage, so lets read from store
        let binding = context.binding;
        if (context.constructor.name === 'SectionedTableProxy') {
            binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
        }
        if (context.constructor.name === 'SelectableSectionProxy') {
            binding = context.getPageProxy().binding;
        }
        if (binding) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyNotificationHeaders('${binding.NotificationNumber}')`, [], '$expand=NotifMobileStatus_Nav&$select=NotifMobileStatus_Nav/MobileStatus').then(function(notificationHeaders) {
                if (notificationHeaders) {
                    const notif = notificationHeaders.getItem(0);
                    if (notif.NotifMobileStatus_Nav) {
                        return notif.NotifMobileStatus_Nav.MobileStatus;
                    } else {
                        return ''; //No mobile status record
                    }
                } else {
                    return '';
                }
            });
        } else {
            return Promise.resolve();
        }
    }

    static isTaskStatusSuccessOrCompleted(context, task) {
        const completedStatus = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        const successStatus = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
        const statusNavLink = task.TaskMobileStatus_Nav || task.ItemTaskMobileStatus_Nav;
        if (statusNavLink && statusNavLink.MobileStatus) {
            const status = statusNavLink.MobileStatus;
            return status === completedStatus || status === successStatus;
        }
        return false;
    }

    static isAllTasksCompletedOrSuccessful(context, tasks) {
        return libEval.evalIsEmpty(tasks) ? true : tasks.every(task => this.isTaskStatusSuccessOrCompleted(context, task));
    }

    static isAllTasksComplete(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Tasks', [], '$expand=TaskMobileStatus_Nav')
            .then(tasks => this.isAllTasksCompletedOrSuccessful(context, tasks))
            .catch(err => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
                return '';
            });
    }

    static isAllItemTasksComplete(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Items', [], '$expand=ItemTasks/ItemTaskMobileStatus_Nav')
            .then(items => libEval.evalIsEmpty(items) ? true : items.every(item => this.isAllTasksCompletedOrSuccessful(context, item.ItemTasks)));
    }

    static isTasksAndItemTasksExists(context) {
        let binding = context.binding;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], "$filter=NotificationNumber eq '" + binding.NotificationNumber + "'&$expand=Tasks,Items/ItemTasks").then(function(results) {
            if (results && results.getItem(0)) {
                const notification = results.getItem(0);
                if ((notification.Tasks && notification.Tasks.length > 0) || (notification.Items.ItemTasks && notification.Items.ItemTasks.length > 0)) {
                    return true;
                }
            }
            return false;
        });
    }
}
