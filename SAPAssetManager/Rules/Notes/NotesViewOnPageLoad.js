import libVal from '../Common/Library/ValidationLibrary';
import { NoteLibrary as NoteLib } from './NoteLibrary';
import WorkOrderCompleted from '../WorkOrders/Details/WorkOrderDetailsOnPageLoad';
import NotificationCompleted from '../Notifications/Details/NotificationDetailsOnPageLoad';
import OperationCompleted from '../WorkOrders/Operations/Details/OperationDetailsOnPageLoad';
import libCommon from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';
import EnableNotificationEdit from '../UserAuthorizations/Notifications/EnableNotificationEdit';
import NotesListLibrary from './List/NotesListLibrary';

export default function NotesViewOnPageLoad(context) {
    // Types of Entity which will have Note Objects 
    const notification = 'MyNotification';
    const myWorkOrderComponent = 'MyWorkOrderComponent';
    const operation = 'MyWorkOrderOperation';
    const floc = 'MyFunctionalLocation';
    const equipment = 'MyEquipment';
    const prt = 'MyWorkOrderTool';
    const operationalItem = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue().split('.')[1];
    const workApproval = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue().split('.')[1];
    const workPermit = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue().split('.')[1];
    const safCertificate = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue().split('.')[1];

    let entityName = context.binding['@odata.type'].split('.')[1];
    if (entityName === 'MeasuringPoint') {
        entityName = 'MyWorkOrderTool';
    }
    // For Notification
    if (entityName.includes(notification)) {
        // If completed, all the action items are already hidden
        return NotificationCompleted(context).then((isCompleted) => {
            if (!isCompleted) {
                return hideEditButton(context, (cnt) => libPersona.isWCMOperator(cnt) && !EnableNotificationEdit(cnt));
            }
            return '';
        });
    } else if (entityName === floc || entityName === equipment) {
        context.setActionBarItemVisible(1, false);
        context.setActionBarItemVisible(0, false);
    } else if (entityName === myWorkOrderComponent) {
        //For local parts, we cannot add or edit note.
        let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
        if (libCommon.isCurrentReadLinkLocal(currentReadLink)) {
            context.setActionBarItemVisible(1, false);
            context.setActionBarItemVisible(0, false);
        }
    } else if (entityName === operation) {
        //Check if Operation 
        return OperationCompleted(context).then((isCompleted) => {
            if (!isCompleted) {
                return hideEditButton(context);
            }
            return '';
        });

    } else if (entityName === prt || entityName === 'S4ServiceOrder' || entityName === 'S4ServiceRequest' || entityName === 'S4ServiceConfirmation') {
        return hideEditButton(context);
    } else if (entityName === operationalItem || entityName === workApproval || entityName === workPermit || entityName === safCertificate) {
        return hideEditButton(context);
    } else if (NotesListLibrary.isListNote(context)) {
        context.setActionBarItemVisible('Add', false);
        
        if (NotesListLibrary.isLogNote(context)) {
            context.setActionBarItemVisible('Edit', false);
        } else {
            context.setActionBarItemVisible('Edit', true);
        }
        return '';
    } else {
        // If completed, all the action items are already hidden
        return WorkOrderCompleted(context).then((isCompleted) => {
            if (!isCompleted) {
                return hideEditButton(context, libPersona.isWCMOperator);
            }
            return '';
        });
    }
}

function hideEditButton(context, personaCheck) {
    return NoteLib.noteDownload(context).then(note => {
        // We need to check IF we have a note and IF that note has a new string
        if (libVal.evalIsEmpty(note) || libVal.evalIsEmpty(note.NewTextString) || !!personaCheck && personaCheck(context)) {
            context.setActionBarItemVisible(0, false);
        }
    });
}
