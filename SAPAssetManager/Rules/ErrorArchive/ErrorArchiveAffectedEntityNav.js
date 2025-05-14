import NotificationItemCauseUpdateNav from '../Notifications/Item/Cause/NotificationItemCauseUpdateNav';
import WorkOrderUpdateNav from '../WorkOrders/WorkOrderUpdateNav';
import WorkOrderOperationUpdateNav from '../WorkOrders/Operations/WorkOrderOperationUpdateNav';
import NotificationUpdateNav from '../Notifications/NotificationUpdateNav';
import NotificationItemUpdateNav from '../Notifications/Item/NotificationItemUpdateNav';
import NotificationTaskUpdateNav from '../Notifications/Task/NotificationTaskUpdateNav';
import NotificationActivityUpdateNav from '../Notifications/Activity/CreateUpdate/NotificationActivityUpdateNav';
import NotificationItemTaskUpdateNav from '../Notifications/Item/Task/NotificationItemTaskUpdateNav';
import NotificationItemActivityUpdateNav from '../Notifications/Item/Activity/NotificationItemActivityUpdateNav';
import { NoteLibrary as NoteLib, TransactionNoteType } from '../Notes/NoteLibrary';
import SubOperationUpdateNav from '../SubOperations/SubOperationUpdateNav';
import MeasurementDocumentUpdateNav from '../Measurements/Document/MeasurementDocumentUpdateNav';
import Logger from '../Log/Logger';
import MaterialDocumentUpdateNav from '../Inventory/MaterialDocument/MaterialDocumentUpdateNav';
import MaterialDocumentItemUpdateNav from '../Inventory/MaterialDocument/MaterialDocumentItemUpdateNav';
import ConfirmationUpdateNav from '../Confirmations/CreateUpdate/ConfirmationUpdateNav';
import PRTEquipmentUpdateNav from '../WorkOrders/Operations/PRT/PRTEquipmentUpdateNav';
import EquipmentUpdateNav from '../Equipment/EquipmentUpdateNav';
import MeterCreateUpdateNavFromDevices from '../Meter/CreateUpdate/MeterCreateUpdateNavFromDevices';
import MeterCreateUpdateNav from '../Meter/CreateUpdate/MeterCreateUpdateNav';
import MeterDisconnectNav from '../Meter/DisconnectReconnect/MeterDisconnectNav';
import ActivityUpdateNav from '../Meter/DisconnectReconnect/ActivityUpdateNav';
import MeterReadingMultipleNavWrapper from '../Meter/Reading/MeterReadingMultipleNavWrapper';
import libCom from '../Common/Library/CommonLibrary';
import InboundDeliveryUpdateNav from '../Inventory/InboundDelivery/InboundDeliveryUpdateNav';
import InboundDeliveryItemUpdateNav from '../Inventory/InboundDelivery/InboundDeliveryItemUpdateNav';
import OutboundDeliveryUpdateNav from '../Inventory/OutboundDelivery/OutboundDeliveryUpdateNav';
import OutboundDeliveryItemUpdateNav from '../Inventory/OutboundDelivery/OutboundDeliveryItemUpdateNav';
import InboundDeliveryItemSerialUpdateNav from '../Inventory/InboundDelivery/InboundDeliveryItemSerialUpdateNav';
import OutboundDeliveryItemSerialUpdateNav from '../Inventory/OutboundDelivery/OutboundDeliveryItemSerialUpdateNav';
import FunctionalLocationUpdateNav from '../FunctionalLocation/CreateUpdate/FunctionalLocationOpenEditPage';
import InspectionLotSetUsageNav from '../WorkOrders/InspectionLot/SetUsage/InspectionLotSetUsageNav';
import OnlyExpenseEditNav from '../Expense/OnlyExpenseEditNav';
import MileageEditNav from '../ServiceOrders/Mileage/MileageEditNav';
import EditPurchaseRequisitionNav from '../Inventory/PurchaseRequisition/EditPurchaseRequisitionNav';
import ServiceConfirmationUpdateNav from '../ServiceConfirmations/CreateUpdate/ServiceConfirmationUpdateNav';
import ServiceConfirmationItemUpdateNav from '../ServiceConfirmations/CreateUpdate/ServiceConfirmationItemUpdateNav';
import SericeOrderUpdateNav from '../ServiceOrders/CreateUpdate/SericeOrderUpdateNav';
import InspectionCharacteristicsDynamicPageNav from '../InspectionCharacteristics/InspectionCharacteristicsDynamicPageNav';
import InspectionPointsDynamicPageNav from '../WorkOrders/Operations/InspectionPoints/InspectionPointsDynamicPageNav';
import { TagStates } from '../WCM/OperationalItems/Details/OperationItemToolBarCaption';
import { OpItemMobileStatusCodes } from '../WCM/OperationalItems/libWCMDocumentItem';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

let ErrorMap = {
    Devices: {
        Action: MeterCreateUpdateNavFromDevices,
    },
    OrderISULinks: {
        Action: MeterCreateUpdateNav,
    },
    DisconnectionObjects: {
        Action: MeterDisconnectNav,
    },
    DisconnectionActivities: {
        Action: ActivityUpdateNav,
    },
    MeterReadings: {
        Action: MeterReadingMultipleNavWrapper,
    },
    MyWorkOrderHeaders: {
        Action: WorkOrderUpdateNav,
    },
    MyWorkOrderComponents: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/Parts/PartCreateUpdateNav.action');
        },
    },
    MyWorkOrderOperations: {
        Action: WorkOrderOperationUpdateNav,
    },
    MyWorkOrderSubOperations: {
        Action: SubOperationUpdateNav,
    },
    MyNotificationHeaders: {
        Action: NotificationUpdateNav,
    },
    MyNotificationItems: {
        Action: NotificationItemUpdateNav,
    },
    MyNotificationTasks: {
        Action: NotificationTaskUpdateNav,
    },
    MyNotificationActivities: {
        Action: NotificationActivityUpdateNav,
    },
    MyNotificationItemCauses: {
        Action: NotificationItemCauseUpdateNav,
    },
    MyNotificationItemTasks: {
        Action: NotificationItemTaskUpdateNav,
    },
    MyNotificationItemActivities: {
        Action: NotificationItemActivityUpdateNav,
    },
    MyWorkOrderHeaderLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderOperationLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderSubOpLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderComponentLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.part());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifHeaderLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notification());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItem());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifTaskLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationTask());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifActivityLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationActivity());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemCauseLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemCause());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemTaskLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemTask());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemActivityLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemActivity());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MeasurementDocuments: {
        Action: MeasurementDocumentUpdateNav,
    },
    WorkOrderTransfers: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferNav.action');
        },
    },
    MaterialDocuments: {
        Action: MaterialDocumentUpdateNav,
    },
    RelatedItem: {
        Action: MaterialDocumentItemUpdateNav,
    },
    UserPreferences: {
        Action: function() { },
    },
    CatsTimesheets: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
        },
    },
    CatsTimesheetTexts: {
        Action: function() { },
    },
    Confirmations: {
        Action: (context) => {
            const mileageActivityType = libCom.getMileageActivityType(context);
            const expenseActivityType = libCom.getExpenseActivityType(context);
            if (context.getBindingObject() && expenseActivityType &&
                context.getBindingObject().ActivityType === expenseActivityType) {
                return OnlyExpenseEditNav(context);
            }
            if (context.getBindingObject() && mileageActivityType &&
                context.getBindingObject().ActivityType === mileageActivityType) {
                context.getPageProxy().setActionBinding(context.binding);
                return MileageEditNav(context);
            }
            return ConfirmationUpdateNav(context);
        },
    },
    MyWorkOrderTools: {
        Action: PRTEquipmentUpdateNav,
    },
    MyEquipments: {
        Action: EquipmentUpdateNav,
    },
    LAMObjectData: {
        Action: (context) => {
            libCom.setStateVariable(context, 'TransactionType', 'UPDATE');
            return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
        },
    },
    InboundDeliveries: {
        Action: InboundDeliveryUpdateNav,
    },
    OutboundDeliveries: {
        Action: OutboundDeliveryUpdateNav,
    },
    InboundDeliveryItems: {
        Action: InboundDeliveryItemUpdateNav,
    },
    OutboundDeliveryItems: {
        Action: OutboundDeliveryItemUpdateNav,
    },
    InboundDeliverySerials: {
        Action: InboundDeliveryItemSerialUpdateNav,
    },
    OutboundDeliverySerials: {
        Action: OutboundDeliveryItemSerialUpdateNav,
    },
    MyFunctionalLocations: {
        Action: FunctionalLocationUpdateNav,
    },
    InspectionCharacteristics: {
        Action: InspectionCharacteristicsDynamicPageNav,
    },
    InspectionPoints: {
        Action: InspectionPointsDynamicPageNav,
    },
    InspectionLots: {
        Action: InspectionLotSetUsageNav,
    },
    PurchaseRequisitionItems: {
        Action: EditPurchaseRequisitionNav,
    },
    PurchaseRequisitionItem_Nav: {
        Action: EditPurchaseRequisitionNav,
    },
    S4ServiceOrders: {
        Action: SericeOrderUpdateNav,
    },
    S4ServiceItems: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateUpdateNav.action');
        },
    },
    S4ServiceConfirmations: {
        Action: ServiceConfirmationUpdateNav,
    },
    ServiceConfirmationItems_Nav: {
        Action: ServiceConfirmationItemUpdateNav,
    },
    S4ServiceConfirmationItems: {
        Action: ServiceConfirmationItemUpdateNav,
    },
    WCMDocumentItems: {
        Action: (context) => {
            const unfixable = '/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveUnkownEntity.action';
            if (libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {  // editing newly created WCMDocumentItem is not supported
                return context.executeAction(unfixable);
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/PMMobileStatus`, [], '')
                .then(pmmobileStatus => {
                    if (!ValidationLibrary.evalIsEmpty(pmmobileStatus) && pmmobileStatus.getItem(0).MobileStatus === OpItemMobileStatusCodes.Tagged) {
                        context.binding.taggingState = TagStates.SetTagged;
                        return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/FixLockNumberNav.action');
                    }
                    return context.executeAction(unfixable);
                })
                .catch(() => context.executeAction(unfixable));
        },
    },
};

export default function ErrorArchiveAffectedEntityNav(context) {
    let errorObject = context.binding.ErrorObject;
    context.getClientData().FromErrorArchive = true;
    context.getClientData().ErrorObject = errorObject;

    let entity = getTargetEntity(errorObject.RequestURL);
    if (ErrorMap[entity]) {
        return ErrorMap[entity].Action(context);
    } else if (ErrorMap[entity.substring(0, entity.indexOf('('))]) {
        return ErrorMap[entity.substring(0, entity.indexOf('('))].Action(context);
    } else {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryErrorArchive.global').getValue(), 'ErrorArchiveAffectedEntityNav: Unknown entity');
        return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveUnkownEntity.action');
    }
}

/**
 * return the target entity from the url
 * @param {*} requestURL the request url, for example "MyWorkOrderHeaders('4002672')/Confirmations"
 */
function getTargetEntity(requestURL) {
    return requestURL.split('/').reverse().find(name => !ValidationLibrary.evalIsEmpty(name)) || '';
}

export function getErrorArchiveMap() {
    return ErrorMap;
}
