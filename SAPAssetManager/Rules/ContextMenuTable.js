import libComm from './Common/Library/CommonLibrary';
import {
    getWorkOrderMenuItems,
    getOperationMenuItems,
    getSubOperationMenuItems,
    getNotificationMenuItems,
    getFunctionalLocationMenuItems,
    getEquipmentMenuItems,
    getTimesheetsMenuItems,
    getConfirmationsMenuItems,
    getDocumentsMenuItems,
    getMeasurementDocumentsMenuItems,
    getRemindersMenuItems,
    getErrorArchiveMenuItems,
  } from './ContextMenuItems';

/**
 * Gets the control field table for the given entity ```type``` given the assignment type
 * @param {String} type one of 'WorkOrder', 'Notification', 'FunctionalLocation', or 'Asset'
 */
export default async function ContextMenuTable(context) {
    let fieldparams = [];
    let entity = libComm.getEntitySetName(context);
    switch (entity) {
        case 'MyWorkOrderHeaders':
            fieldparams = await getWorkOrderMenuItems(context);
            break;
        case 'MyWorkOrderOperations':
            fieldparams = getOperationMenuItems(context);
            break;
        case 'MyWorkOrderSubOperations':
            fieldparams = getSubOperationMenuItems(context);
            break;
        case 'MyNotificationHeaders':
            fieldparams = getNotificationMenuItems();
            break;
        case 'MyFunctionalLocations':
            fieldparams = getFunctionalLocationMenuItems();
            break;
        case 'MyEquipments':
            fieldparams = getEquipmentMenuItems();
            break;
        case 'CatsTimesheetOverviewRows':
            fieldparams = getTimesheetsMenuItems();
            break;
        case 'Confirmations':
            fieldparams = getConfirmationsMenuItems();
            break;
        case 'MyFuncLocDocuments':
        case 'MyNotifDocuments':
        case 'MyEquipDocuments':
        case 'MyWorkOrderDocuments':
        case 'S4ServiceOrderDocuments':
            fieldparams = getDocumentsMenuItems();
            break;
        case 'Documents':
            fieldparams = getDocumentsMenuItems();
            break;
        case 'MeasurementDocuments':
            fieldparams = getMeasurementDocumentsMenuItems();
            break;
        case 'UserPreferences':
            fieldparams = getRemindersMenuItems();
            break;
        case 'ErrorArchive':
            fieldparams = getErrorArchiveMenuItems();
            break;
        default:
            break;
    }

    return fieldparams;
}
