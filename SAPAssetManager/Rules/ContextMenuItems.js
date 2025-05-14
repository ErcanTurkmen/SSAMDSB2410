import MobileStatusGeneratorWrapper from './MobileStatus/MobileStatusGeneratorWrapper';
import libMobile from './MobileStatus/MobileStatusLibrary';
import CurrentMobileStatusOverride from './MobileStatus/CurrentMobileStatusOverride';

export async function getWorkOrderMenuItems(context) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
    const statusMenuItems = await getStatusMenuItemsForObjectType(context, objectType);

    return [
        {
            '_Name': 'Add_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L,add_order)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Add_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderNotificationCreateNav.js',
        },
        {
            '_Name': 'Edit_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
        {
            '_Name': 'Delete_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
        {
            '_Name': 'Take_Reading',
            'Image': '$(PLT, /SAPAssetManager/Images/reading.png, /SAPAssetManager/Images/reading.android.png)',
            'Text': '$(L,take_readings)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
        },
        ...statusMenuItems,
    ];
}

function getStatusMenuItemsOnSwipeRules(context) {
    const {
        STARTED, HOLD, COMPLETED, TRANSFER, WORKCOMPL,
        TRAVEL, ONSITE, ACCEPTED, REJECTED,
        REVIEW, APPROVED, DISAPPROVED, ASSIGN, UNASSIGN, REASSIGN,
        CONFIRM, UNCONFIRM, 
    } = libMobile.getMobileStatusValueConstants(context);

    return {
        [STARTED]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/StartMobileStatusUpdateWrapper.js',
        [HOLD]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/HoldMobileStatusUpdateWrapper.js',
        [COMPLETED]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/CompleteMobileStatusUpdateWrapper.js',
        [TRANSFER]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/TransferMobileStatusUpdateWrapper.js',
        [TRAVEL]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/EnrouteMobileStatusUpdateWrapper.js',
        [ONSITE]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/OnsiteMobileStatusUpdateWrapper.js',
        [APPROVED]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/ApproveMobileStatusUpdateWrapper.js',
        [DISAPPROVED]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/DisapproveMobileStatusUpdateWrapper.js',
        [REVIEW]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/ReviewMobileStatusUpdateWrapper.js',
        [ASSIGN]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/AssignMobileStatusUpdateWrapper.js',
        [UNASSIGN]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/UnAssignMobileStatusUpdateWrapper.js',
        [REASSIGN]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/ReAssignMobileStatusUpdateWrapper.js',
        [WORKCOMPL]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/WorkCompletedMobileStatusUpdateWrapper.js',
        [ACCEPTED]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/AcceptMobileStatusUpdateWrapper.js',
        [REJECTED]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/RejectMobileStatusUpdateWrapper.js',
        [CONFIRM]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/ConfirmMobileStatusUpdateWrapper.js',
        [UNCONFIRM]: '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/UnconfirmMobileStatusUpdateWrapper.js',
    };
}

export function getNotificationMenuItems() {
    return [
        {
            '_Name': 'Add_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '',
        },
        {
            '_Name': 'Add_Item',
            'Image': '$(PLT, /SAPAssetManager/Images/additem.png, /SAPAssetManager/Images/additem.android.png)',
            'Text': '$(L,add_item)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/Item/CreateUpdate/NotificationItemCreateNav.js',
        },
        {
            '_Name': 'Start_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            'Text': '$(L,start)',
            'Mode': 'Normal',
            'Style': 'ContextMenuGreen',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/MobileStatus/NotificationMobileStatusHandler.js',
        },
        {
            '_Name': 'End_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
            'Text': '$(L,complete)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/MobileStatus/NotificationMobileStatusHandler.js',
        },
        {
            '_Name': 'Edit_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/NotificationUpdateNav.js',
        },
        {
            '_Name': 'Delete_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
    ];
}

export async function getOperationMenuItems(context) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
    const statusMenuItems = await getStatusMenuItemsForObjectType(context, objectType);

    return [
        {
            '_Name': 'Add_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/add.png, /SAPAssetManager/Images/add.android.png)',
            'Text': '$(L,add_operation)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Add_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/WorkOrderOperationNotificationCreateNav.js',
        },
        {
            '_Name': 'Edit_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationUpdateNav.js',
        },
        {
            '_Name': 'Delete_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
        ...statusMenuItems,
    ];
}

export async function getSubOperationMenuItems(context) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
    const statusMenuItems = await getStatusMenuItemsForObjectType(context, objectType);

    return [
        {
            '_Name': 'Add_SubOperation',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L,add_suboperation)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Edit_SubOperation',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/SubOperationUpdateNav.js',
        },
        {
            '_Name': 'Delete_SubOperation',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
        ...statusMenuItems,
    ];
}

export function getEquipmentMenuItems() {
    return [
        {
            '_Name': 'Add_NotificationFromEquipment',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav.js',
        },
        {
            '_Name': 'Add_WorkOrderFromEquipment',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L,add_workorder)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNav.js',
        },
        {
            '_Name': 'Take_Reading',
            'Image': '$(PLT, /SAPAssetManager/Images/reading.png, /SAPAssetManager/Images/reading.android.png)',
            'Text': '$(L,take_readings)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
        },
    ];
}

export function getFunctionalLocationMenuItems() {
    return [
        {
            '_Name': 'Add_NotificationFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L, add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav.js',
        },
        {
            '_Name': 'Add_WorkOrderFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L, add_workorder)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNav.js',
        },
        {
            '_Name': 'Take_Reading',
            'Image': '$(PLT, /SAPAssetManager/Images/reading.png, /SAPAssetManager/Images/reading.android.png)',
            'Text': '$(L,take_readings)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
        },
    ];
}

export function getTimesheetsMenuItems() {
    return [
        {
            '_Name': 'Add_NotificationFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/add.png, /SAPAssetManager/Images/add.android.png)',
            'Text': '$(L, add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Add_WorkOrderFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L, add_workorder)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
        {
            '_Name': 'Delete_Timesheet',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
    ];
}

export function getConfirmationsMenuItems() {
    return [
        {
            '_Name': 'Edit_Confirmation',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Delete_Confirmation',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
    ];
}

export function getDocumentsMenuItems() {
    return [
        {
            '_Name': 'Delete_Document',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L, delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
    ];
}

export function getMeasurementDocumentsMenuItems() {
    return [
        {
            '_Name': 'Edit_MeasurementDocument',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L, edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
        {
            '_Name': 'Delete_MeasurementDocument',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L, delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
    ];
}

function deleteEntry() {
    return {
        '_Name': 'Delete_Entry',
        'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
        'Text': '$(L, delete)',
        'Mode': 'Deletion',
        'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
    };
}

export function getRemindersMenuItems() {
    return [deleteEntry()];
}

export function getErrorArchiveMenuItems() {
    return [deleteEntry()];
}

async function getStatusMenuItemsForObjectType(context, objectType) {
    const onSwipeRules = getStatusMenuItemsOnSwipeRules(context);
    const currentStatusOverride = CurrentMobileStatusOverride(context, context.binding);
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, context.binding, objectType, currentStatusOverride);    
    const statusMenuItems = await StatusGeneratorWrapper.generateMobileStatusOptions();
    
    return statusMenuItems.map(option => {  
        const status = option._Name?.split('_')[1];      
        if (Object.hasOwn(onSwipeRules, status)) {
            return {
                ...option,
                OnSwipe: onSwipeRules[status],
            };
        }

        return {
            ...option,
            OnSwipe: {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'EAMOverallStatusConfigs',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': `$filter=MobileStatus eq '${status}' and ObjectType eq '${objectType}'`,
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/MobileStatus/StatusUpdateWrappers/GenericMobileStatusUpdateWrapper.js',
                },
            },
        };
    });
}
