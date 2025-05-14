import libCom from './Common/Library/CommonLibrary';
import NotificationEnableMobileStatus from './Notifications/MobileStatus/NotificationEnableMobileStatus';
import MobileStatusLibrary from './MobileStatus/MobileStatusLibrary';
import IsPhaseModelEnabled from './Common/IsPhaseModelEnabled';
import EnableWorkOrderCreate from './UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import MobileStatusGeneratorWrapper from './MobileStatus/MobileStatusGeneratorWrapper';
import StatusUIGenerator from './MobileStatus/StatusUIGenerator';
import CurrentMobileStatusOverride from './MobileStatus/CurrentMobileStatusOverride';
import { reloadUserTimeEntriesForLocalStatus } from './OverviewPage/MyWorkSection/ObjectCardButtonVisible';

export default function ContextMenuLeadingItems(context) {

    // Declare mobile statuses as rule-scoped constants
    const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const SUCCESS = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());

    // Helper function: determine items to show for Notification context menu
    const notificationStartComplete = function() {
        return NotificationEnableMobileStatus(context).then(enabled => {
            const leadingItems = [];
            if (!enabled) {
                return leadingItems;
            }
            leadingItems.push('Add_Item');
            if (MobileStatusLibrary.getMobileStatus(context.binding, context) === STARTED) {
                if (IsPhaseModelEnabled(context)) {
                    leadingItems.unshift('End_Notification');
                } else {
                    return checkUnfinishedTasks(context, { COMPLETED, SUCCESS }).then(([isAllTaskItemsFinished, isAllTasksFinished]) => {
                        if (isAllTaskItemsFinished && isAllTasksFinished) {
                            leadingItems.unshift('End_Notification');
                        }
                        return leadingItems;
                    });
                }
            } else if (MobileStatusLibrary.getMobileStatus(context.binding, context) === RECEIVED) {
                leadingItems.unshift('Start_Notification');
            }
            return leadingItems;
        });
    };

    // Helper function: determine items to show for Work Order context menu
    let orderMobileStatusItems = async function() {
        const statusItems = await getStatuses();

        if (!libCom.isDefined(statusItems)) {
            const mobileStatus = context.binding?.OrderMobileStatus_Nav?.MobileStatus;
            
            if (mobileStatus !== COMPLETED) {
                return ['Add_Notification'];
            }
            return [];
        }
        return statusItems;
    };

    const getStatuses = async function() {
        const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
        const items = await getStatusMenuItemsForObjectType(context, objectType);

        return items;
    };

    // Helper function: determine items to show for Operation context menu
    let operationMobileStatusMenuItems = async function() {
        const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
        const items = await getStatusMenuItemsForObjectType(context, objectType);

        return items;
    };
   
    let operationMenuItems = async function(navLinkName) {
        const statusItems = await operationMobileStatusMenuItems();

        if (!libCom.isDefined(statusItems)) {
            const mobileStatus = context.binding?.[navLinkName]?.MobileStatus;
            
            if (mobileStatus !== COMPLETED) {
                return ['Add_Notification'];
            }
            return [];
        }
        return statusItems;
    };

    // Rule logic begins here //
    let leading = [];
    let entityType = context.binding['@odata.type'];
    let enableWorkOrderCreate = EnableWorkOrderCreate(context);

    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader':
            leading = orderMobileStatusItems();
            break;
        case '#sap_mobile.MyWorkOrderOperation':
            leading = operationMenuItems('OperationMobileStatus_Nav');
            break;
        case '#sap_mobile.MyWorkOrderSubOperation':
            leading = operationMenuItems('SubOpMobileStatus_Nav');
            break;
        case '#sap_mobile.MyNotificationHeader':
            leading = notificationStartComplete();
            break;
        case '#sap_mobile.MyFunctionalLocation':
            if (enableWorkOrderCreate) {
                leading = Promise.resolve(['Add_NotificationFromFloc', 'Add_WorkOrderFromFloc']);
            } else {
                leading = Promise.resolve(['Add_NotificationFromFloc']);
            }
            break;
        case '#sap_mobile.MyEquipment':
            if (enableWorkOrderCreate) {
                leading = Promise.resolve(['Add_NotificationFromEquipment', 'Add_WorkOrderFromEquipment']);
            } else {
                leading = Promise.resolve(['Add_NotificationFromEquipment']);
            }
            break;
        case '#sap_mobile.CatsTimesheetOverviewRows':
            leading = Promise.resolve(['Delete_Timesheet']);
            break;
        case '#sap_mobile.Confirmations':
            leading = Promise.resolve(['Delete_Confirmation']);
            break;
        case '#sap_mobile.MyFuncLocDocuments':
            break;
        case '#sap_mobile.MyNotifDocuments':
            break;
        case '#sap_mobile.MyEquipDocuments':
            break;
        case '#sap_mobile.MyWorkOrderDocuments':
            break;
        case '#sap_mobile.Documents':
            break;
        case '#sap_mobile.MeasurementDocuments':
            leading = Promise.resolve(['Delete_MeasurementDocument']);
            break;
        default:
            break;
    }
    return leading;
}

function checkUnfinishedTasks(context, statuses = {}) {
    // Get number of Items with unfinished Item Tasks. If zero, return true
    const allItemTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Items`, `$filter=ItemTasks/any(itmTask : itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${statuses.COMPLETED}' and itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${statuses.SUCCESS}')`).then(count => {
        return count === 0;
    });
    // Get number of unfinished Tasks. If zero, return true
    const allTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Tasks`, `$filter=TaskMobileStatus_Nav/MobileStatus ne '${statuses.COMPLETED}' and TaskMobileStatus_Nav/MobileStatus ne '${statuses.SUCCESS}'`).then(count => {
        return count === 0;
    });

    return Promise.all([allItemTasksComplete, allTasksComplete]);
}

async function getStatusMenuItemsForObjectType(context, objectType) {
    const binding = context.binding;

    await reloadUserTimeEntriesForLocalStatus(context, binding);
    
    const currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);    
    let options = await StatusGeneratorWrapper.generateMobileStatusOptions();
    StatusUIGenerator.orderItemsByTransitionType(options);

    return options.map(option => option._Name);
}
