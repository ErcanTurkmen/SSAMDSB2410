import libNotifMobile from './NotificationMobileStatusLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import Logger from '../../Log/Logger';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import HideActionItems from '../../Common/HideActionItems';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
import AutoSyncLibrary from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import sdfIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';
import { NotificationDetailsPageName } from '../Details/NotificationDetailsPageToOpen';

export default function NotificationMobileStatusUpdateOnSuccess(context) {

    let mobileStatusUpdateActionResult = context.getActionResult('MobileStatusUpdate');

    if (mobileStatusUpdateActionResult) {
        let mobileStatusUpdateActionResultObject = JSON.parse(mobileStatusUpdateActionResult.data);

        const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        let pageContext = MobileStatusLibrary.getPageContext(context, NotificationDetailsPageName(context));
        context.showActivityIndicator('');

        if (mobileStatusUpdateActionResultObject.MobileStatus === COMPLETE) {
            //Only allow notification complete if all header and item level tasks are complete
            let tasksPromises = [];
            tasksPromises.push(libNotifMobile.isAllTasksComplete(context));
            tasksPromises.push(libNotifMobile.isAllItemTasksComplete(context));
            const sdfEnabled = sdfIsFeatureEnabled(context);
            let sdfPromise = Promise.resolve(true);
            if (sdfEnabled) {
                sdfPromise = FormInstanceCount(context, true).then((count) => count === 0);
            }
            tasksPromises.push(sdfPromise);

            return Promise.all(tasksPromises).then(completionTestResults => {
                return processResults(context, completionTestResults, pageContext);
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
                return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action').then(() => {
                    //Rollback mobile status update on any errors
                    return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
                });
            }).finally(() => {
                context.dismissActivityIndicator();
            });
        }
        LocationUpdate(context);
        return ToolbarRefresh(context).then(() => {
            return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                return AutoSyncLibrary.autoSyncOnStatusChange(context);
            });
        }).finally(() => {
            context.dismissActivityIndicator();
        });
    }

}

/**
 * checks the results of the completion flags and executes the appropriate actions
 * @param {*} context
 * @param {[boolean]} completionTestResults completion test results. [taskcomplete, itemtaskcomplete, sdfMandatoryFormsComplete]
 * @param {*} pageContext
 * @returns
 */
function processResults(context, completionTestResults, pageContext) {
    // check if there are incomplete mandatory forms
    if (!completionTestResults[2]) {
        return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationFormPendingError.action').then(() => {
            //Rollback mobile status update on any errors
            return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
        });
    }
    if (completionTestResults[0] && completionTestResults[1]) {
        return libNotifMobile.completeNotification(context).then(() => {
            LocationUpdate(context);
            return ToolbarRefresh(context).then(() => {
                HideActionItems(pageContext.getPageProxy(), 2);
                return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                    return AutoSyncLibrary.autoSyncOnStatusChange(context);
                });
            });
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action').then(() => {
        //Rollback mobile status update on any errors
        return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
    });
}
