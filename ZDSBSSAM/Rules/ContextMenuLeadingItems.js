import libCom from '../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import NotificationEnableMobileStatus from '../../SAPAssetManager/Rules/Notifications/MobileStatus/NotificationEnableMobileStatus';
import MobileStatusLibrary from '../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import IsPhaseModelEnabled from '../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import EnableWorkOrderCreate from '../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import MobileStatusGeneratorWrapper from '../../SAPAssetManager/Rules/MobileStatus/MobileStatusGeneratorWrapper';
import StatusUIGenerator from '../../SAPAssetManager/Rules/MobileStatus/StatusUIGenerator';
import CurrentMobileStatusOverride from '../../SAPAssetManager/Rules/MobileStatus/CurrentMobileStatusOverride';
import { reloadUserTimeEntriesForLocalStatus } from '../../SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardButtonVisible';
import isPlannedWO from './WorkOrders/ZIsPlannedWorkOrderType';
import libClock from '../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import libOPMobile from '../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';

export default function ContextMenuLeadingItems(context) {

    // Declare mobile statuses as rule-scoped constants
    const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const SUCCESS = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());

    // Helper function: determine items to show for Notification context menu
    const notificationStartComplete = function () {
        return NotificationEnableMobileStatus(context).then(enabled => {
            const leadingItems = [];
            if (!enabled) {
                return leadingItems;
            }
            //DSB customisation to remove add Item and add activity
            //leadingItems.push('Add_Item');
            leadingItems.push('Add_Activity');
            let notifType = context.binding.NotificationType;
            if (notifType !== '32') //check notif type for status to be enabled. new change to enable comp for 31 and 41, hence removed
            {
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
            }// notif type check end
            return leadingItems;
        });
    };

    // Helper function: determine items to show for Work Order context menu
    let orderMobileStatusItems = async function () {
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

    const getStatuses = async function () {
        const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
        const items = await getStatusMenuItemsForObjectType(context, objectType);

        return items;
    };

    // Helper function: determine items to show for Operation context menu
    let operationMobileStatusMenuItems = async function () {
        const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
        const items = await getStatusMenuItemsForObjectType(context, objectType);

        return items;
    };

    let operationMenuItems = async function (navLinkName) {
        const statusItems = await operationMobileStatusMenuItems();

        if (!libCom.isDefined(statusItems)) {
            const mobileStatus = context.binding?.[navLinkName]?.MobileStatus;
            //Start of DSB customization for swipe menu
            let fieldKey = context.binding.FieldKey;
            fieldKey = fieldKey.toUpperCase();
            let zTimeRegKey = context.binding.ZTimeRegKey;
            zTimeRegKey = zTimeRegKey.toUpperCase();

            let pma = context.binding.WOHeader.MaintenanceActivityType;
            let orderType = context.binding.WOHeader.OrderType;
            let isPlannedWorkorder = isPlannedWO(context);
            // show only complete button
            //Enable for planned orders with no time reg key and field key
            //unplanned orders if SO13 order type then PMA should   be 288 or  295 and zTimeRegKey  !== 'X'
            //if (isPlannedWorkorder && fieldKey  !== 'OVERSKR' && zTimeRegKey  !== 'X')
            if ((isPlannedWorkorder && fieldKey !== 'OVERSKR' && zTimeRegKey !== 'X') || ((!isPlannedWorkorder && orderType === 'SO13' && (pma === '288' || pma === '295') && zTimeRegKey !== 'X'))) {
                if ((context.binding.OperationNo === '0010') || (mobileStatus === COMPLETED)) {
                    return Promise.resolve([]);
                }
                else {
                    //leading = Promise.resolve(['ZConfirm']);
                    return ['ZConfirm'];
                }
            }
            //To show show start/hold/complete
            //status button (start/hold/complete) - unplanned orders if not SO13 order type
            //or unplanned orders if SO13 order type then zTimeRegKey  === 'X'
            // or planned orders with key 
            // and not operation 0010
            if (((!isPlannedWorkorder && orderType !== 'SO13') || (!isPlannedWorkorder && orderType === 'SO13' && (pma !== '288' || pma !== '295')) || (!isPlannedWorkorder && orderType === 'SO13' && (pma === '288' || pma === '295') && zTimeRegKey === 'X') || (isPlannedWorkorder && fieldKey !== 'OVERSKR' && zTimeRegKey === 'X')) && (context.binding.OperationNo !== '0010'))

            {

                if (libClock.isBusinessObjectClockedIn(context)) {
                    if ((!isPlannedWorkorder && orderType === 'SO13' && zTimeRegKey !== 'X') || (!isPlannedWorkorder && orderType !== 'SO13')) {
                        leading = Promise.resolve(['Complete_Operation', 'Hold_Operation']);
                    }
                    else {
                        leading = Promise.resolve(['Hold_Operation']);
                    }
                }
                else if (mobileStatus === RECEIVED || mobileStatus === HOLD) {
                    leading = libOPMobile.isAnyOperationStarted(context).then(isAnyOperationStarted => {
                        if (!isAnyOperationStarted) {
                            //return Promise.resolve(['Start_Operation']);
                            return ['Start_Operation'];
                        }
                        else { return Promise.resolve([]); }
                    });
                }
                else if (mobileStatus === STARTED) {
                    //if (libClock.isCICOEnabled(context)) 
                    //{ //Handle clock in/out feature
                    if (context.binding.ClockSapUserName && context.binding.ClockSapUserName === libCom.getSapUserName(context)) {
                        //This op was started by current user
                        //if unplanned then hold and complete operation else planned Wo with field key only hold
                        //if(!isPlannedWorkorder ) {
                        if ((!isPlannedWorkorder && orderType === 'SO13' && zTimeRegKey !== 'X') || (!isPlannedWorkorder && orderType !== 'SO13')) {
                            leading = Promise.resolve(['Complete_Operation', 'Hold_Operation']);
                        }
                        else {
                            leading = Promise.resolve(['Hold_Operation']);
                        }
                    } else {
                        //This op was started by someone else, so clock current user in and adjust mobile status
                        leading = libOPMobile.isAnyOperationStarted(context).then(isAnyOperationStarted => {
                            if (!isAnyOperationStarted) {
                                //return Promise.resolve(['Start_Operation']);
                                return ['Start_Operation'];
                            }
                            else {
                                //return Promise.resolve([]);
                                return libClock.reloadUserTimeEntries(context).then(() => {
                                    if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mobileStatus)) {
                                        //return Promise.resolve(context.localizeText('clock_out'));
                                        //return ['Hold_Operation'];
                                        if ((!isPlannedWorkorder && orderType === 'SO13' && zTimeRegKey !== 'X') || (!isPlannedWorkorder && orderType !== 'SO13')) {
                                            return Promise.resolve(['Complete_Operation', 'Hold_Operation']);
                                        }
                                        else {
                                            return Promise.resolve(['Hold_Operation']);
                                        }
                                    } else {
                                        return Promise.resolve([]);
                                    }
                                });

                            }

                        });
                    } //end if check user GUID
                    /* } 
                     else {
                        leading = Promise.resolve(['Hold_Operation', 'Complete_Operation']);
                     } // end if else  libclock        */
                } else { //if else for operation started
                    leading = Promise.resolve([]);
                }
            }
            // if (mobileStatus !== COMPLETED) {
            //     return ['Add_Notification'];
            // }
            // return [];
        }
        //End of DSB customization for swipe menu
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
            // DSB customisation to remove Add WO
            // if (enableWorkOrderCreate) {
            //     leading = Promise.resolve(['Add_NotificationFromFloc', 'Add_WorkOrderFromFloc']);
            // } else {
            leading = Promise.resolve(['Add_NotificationFromFloc']);
            //}
            break;
        case '#sap_mobile.MyEquipment':
            // DSB customisation to remove Add WO
            // if (enableWorkOrderCreate) {
            //     leading = Promise.resolve(['Add_NotificationFromEquipment', 'Add_WorkOrderFromEquipment']);
            // } else {
            leading = Promise.resolve(['Add_NotificationFromEquipment']);
            //}
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
