import libMobile from '../../../MobileStatus/MobileStatusLibrary';
import Logger from '../../../Log/Logger';
import libCommon from '../../../Common/Library/CommonLibrary';
import HideActionItems from '../../../Common/HideActionItems';
import NotificationMobileStatus from '../../../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import ExecuteActionWithAutoSync from '../../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import { NotificationDetailsPageName } from '../../Details/NotificationDetailsPageToOpen';

const notificationItemTaskDetailsPage = 'NotificationItemTaskDetailsPage';

export default class {

    static startTask(context) {
        let pageContext = libMobile.getPageContext(context, notificationItemTaskDetailsPage);
        libMobile.setStartStatus(pageContext);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskStartUpdate.action').then(function() {
            pageContext.setToolbarItemCaption('StartTaskTbI', context.localizeText('end_task'));
            context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static completeTask(context) {
        let pageContext = libMobile.getPageContext(context, notificationItemTaskDetailsPage);
        libMobile.setCompleteStatus(pageContext);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskCompleteUpdate.action').then(function() {
            pageContext.setToolbarItemCaption('StartTaskTbI', context.localizeText('task_success'));
            HideActionItems(context.getPageProxy(), 2);
            context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static successTask(context) {
        let pageContext = libMobile.getPageContext(context, notificationItemTaskDetailsPage);
        libMobile.setSuccessStatus(pageContext);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskSuccessUpdate.action').then(function() {
            pageContext.setToolbarItemCaption('StartTaskTbI', pageContext.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/SuccessText.global').getValue());
            libCommon.enableToolBar(context, notificationItemTaskDetailsPage, 'StartTaskTbI', false);
            context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static completeTaskWithoutSuccessFlag(context) {
        let pageContext = libMobile.getPageContext(context, notificationItemTaskDetailsPage);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskCompleteUpdate.action').then(function() {
            libCommon.enableToolBar(context, notificationItemTaskDetailsPage, 'StartTaskTbI', false);
            HideActionItems(context.getPageProxy(), 2);
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static getMobileStatus(context) {
        return new Promise((resolve, reject) => {
            try {
                resolve(libMobile.getMobileStatus(context.binding, context));
            } catch (error) {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
                reject('');
            }
        });
    }

    static readTaskMobileStatus(context) {
        let link = '';

        if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationTask') {
            link = '/TaskMobileStatus_Nav';
        } else {
            link = '/ItemTaskMobileStatus_Nav';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + link, [], '$select=MobileStatus').then(status => {
            if (status) {
                let taskMobileStatus = status.getItem(0);
                return taskMobileStatus.MobileStatus;
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

    static getHeaderMobileStatus(context) {
        let pageContext = libMobile.getPageContext(context, NotificationDetailsPageName(context));
        return this.getMobileStatus(pageContext);
    }
}
