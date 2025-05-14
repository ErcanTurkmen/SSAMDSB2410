import DocLib from './DocumentLibrary';
import Logger from '../Log/Logger';


export default function DocumentsBDSListEntitySet(controlProxy) {
    let value = '';
    Logger.debug(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), controlProxy.getPageProxy().getBindingObject());
    Logger.debug(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'type: ' + controlProxy.getPageProxy().getBindingObject()['@odata.type']);
    switch (DocLib.lookupParentObjectType(controlProxy, controlProxy.getPageProxy().getBindingObject()['@odata.type'])) {
        case DocLib.ParentObjectType.WorkOrder:
            value = controlProxy.binding['@odata.readLink'] + '/WODocuments';
            break;
        case DocLib.ParentObjectType.MaterialDocument:
            value = controlProxy.binding['@odata.readLink'] + '/MatDocAttachment_Nav';
            break;
        case DocLib.ParentObjectType.Notification:
            value = controlProxy.binding['@odata.readLink'] + '/NotifDocuments';
            break;
        case DocLib.ParentObjectType.Equipment:
            value = controlProxy.binding['@odata.readLink'] + '/EquipDocuments';
            break;
        case DocLib.ParentObjectType.OnlineEquipment:
            value = controlProxy.binding['@odata.readLink'] + '/Document';
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            value = controlProxy.binding['@odata.readLink'] + '/FuncLocDocuments';
            break;
        case DocLib.ParentObjectType.OnlineFunctionalLocation:
            value = controlProxy.binding['@odata.readLink'] + '/FuncLocDocument';
            break;
        case DocLib.ParentObjectType.Operation:
            value = controlProxy.binding['@odata.readLink'] + '/WOOprDocuments_Nav';
            break;
        case DocLib.ParentObjectType.WCMDocumentHeader:
            value = controlProxy.binding['@odata.readLink'] + '/WCMDocumentHeaderAttachments';
            break;
        case DocLib.ParentObjectType.WCMApproval:
            value = controlProxy.binding['@odata.readLink'] + '/WCMApprovalAttachments';
            break;
        case DocLib.ParentObjectType.WCMApplication:
            value = controlProxy.binding['@odata.readLink'] + '/WCMApplicationAttachments';
            break;
        case DocLib.ParentObjectType.WCMDocumentItem:
            value = controlProxy.binding['@odata.readLink'] + '/WCMDocumentItemAttachments';
            break;
        case DocLib.ParentObjectType.InspectionLot:
            value = controlProxy.binding['@odata.readLink'] + '/InspectionLotDocument_Nav';
            if (controlProxy.binding['@odata.type'] === '#sap_mobile.EAMChecklistLink' || controlProxy.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || controlProxy.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
                value = controlProxy.binding['@odata.readLink'] + '/InspectionLot_Nav/InspectionLotDocument_Nav';
            }
            break;
        case DocLib.ParentObjectType.S4ServiceQuotation:
        case DocLib.ParentObjectType.S4ServiceRequest:
        case DocLib.ParentObjectType.S4ServiceConfirmation:
        case DocLib.ParentObjectType.S4ServiceConfirmationItem:
        case DocLib.ParentObjectType.S4ServiceOrder:
            value = controlProxy.binding['@odata.readLink'] + '/Document';
            break;
        case DocLib.ParentObjectType.S4ServiceQuotationItem:
            value = 'S4ServiceQuotationDocuments';
            break;    
        case DocLib.ParentObjectType.S4ServiceItem:
            value = 'S4ServiceOrderDocuments';
            break;
        case DocLib.ParentObjectType.OnlineNotification:
            value = controlProxy.binding['@odata.readLink'] + '/NotifDocuments';
            break;
        default:
            break;
    }
    /**Implementing our Logger class*/
    Logger.debug(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'EntitySet: ' + value);

    return value;
}
