import libMobile from '../../MobileStatus/MobileStatusLibrary';
import Logger from '../../Log/Logger';
import libCommon from '../../Common/Library/CommonLibrary';
import HideActionItems from '../../Common/HideActionItems';
import NotificationMobileStatus from '../MobileStatus/NotificationMobileStatusLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

const notificationTaskDetailsPage = 'NotificationTaskDetailsPage';

export default class {

    static startTask(context) {
        const pageProxy = context.getPageProxy();
        return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskStartUpdate.action').then(function() {
            libMobile.setStartStatus(context, pageProxy.getActionBinding());
            pageProxy.getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static completeTask(context) {
        const pageProxy = context.getPageProxy();
        return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskCompleteUpdate.action').then(function() {
            libMobile.setCompleteStatus(context, pageProxy.getActionBinding());
            pageProxy.getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            if (libCommon.getPageName(context) === notificationTaskDetailsPage) {
                HideActionItems(pageProxy, 2);
            }
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static successTask(context) {
        const pageProxy = context.getPageProxy();
        return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskSuccessUpdate.action').then(function() {
            libMobile.setSuccessStatus(context);
            pageProxy.getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static completeTaskWithoutSuccessFlag(context) {
        const pageProxy = context.getPageProxy();
        return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskCompleteUpdate.action').then(function() {
            libMobile.setCompleteStatus(context, pageProxy.getActionBinding());
            if (libCommon.getPageName(context) === notificationTaskDetailsPage) {
                HideActionItems(pageProxy, 2);
            }
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static readTaskMobileStatus(context) {
        let msLink = 'TaskMobileStatus_Nav';
        if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationTask') {
            msLink = 'ItemTaskMobileStatus_Nav';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], `$expand=${msLink}&$select=${msLink}/MobileStatus`).then(status => {
            if (status) {
                const taskMobileStatus = status.getItem(0);
                return taskMobileStatus.TaskMobileStatus_Nav.MobileStatus;
            } else {
                return '';
            }
        });
    }

    static readHeaderMobileStatus(context) {
        return NotificationMobileStatus.getHeaderMobileStatus(context).then(status => {
            return status;
        });
    }


    static getMobileStatus(context) {
        return libMobile.getMobileStatus(context.binding, context);
    }
}
