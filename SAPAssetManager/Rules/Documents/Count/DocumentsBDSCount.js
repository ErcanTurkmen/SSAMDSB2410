import DocLib from '../DocumentLibrary';

export default async function DocumentsBDSCount(controlProxy, bindingObject) {
    const binding = bindingObject || controlProxy.getPageProxy().binding || controlProxy.getBindingObject();

    let value = 0;
    let id = binding.ObjectID;
    let item_num = binding.ItemNo;
    let operation_num = '';
    let year = '';
    switch (DocLib.lookupParentObjectType(controlProxy, binding['@odata.type'])) {
        case DocLib.ParentObjectType.WorkOrder:
            id = binding.OrderId;
            value = DocLib.getDocumentCount(controlProxy, 'MyWorkOrderDocuments', "$expand=Document&$filter=OrderId eq '" + id + "' and (OperationNo eq null or OperationNo eq '') and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.Notification:
            id = binding.NotificationNumber;
            value = DocLib.getDocumentCount(controlProxy, 'MyNotifDocuments', "$expand=Document&$filter=NotificationNumber eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.MaterialDocument:
        case DocLib.ParentObjectType.MaterialDocItem:
            id = binding.MaterialDocNumber;
            year = binding.MaterialDocYear;
            value = DocLib.getDocumentCount(controlProxy, 'MatDocAttachments', "$expand=Document&$filter=MaterialDoc eq '" + id + "' and MatDocYear eq '" + year + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.Equipment:
            id = binding.EquipId;
            value = DocLib.getDocumentCount(controlProxy, 'MyEquipDocuments', "$expand=Document&$filter=EquipId eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.OnlineEquipment:
            id = binding.EquipId;
            value = DocLib.getDocumentCount(controlProxy, 'EquipmentDocuments', "$filter=EquipId eq '" + id + "'", true);
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            id = binding.FuncLocIdIntern;
            value = DocLib.getDocumentCount(controlProxy, 'MyFuncLocDocuments', "$expand=Document&$filter=FuncLocIdIntern eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.OnlineFunctionalLocation:
            id = binding.FuncLocIdIntern;
            value = DocLib.getDocumentCount(controlProxy, 'FuncLocDocuments', "$filter=FuncLocIdIntern eq '" + id + "'", true);
            break;
        case DocLib.ParentObjectType.Operation:
            id = binding.OrderId;
            operation_num = binding.OperationNo;
            value = DocLib.getDocumentCount(controlProxy, 'MyWorkOrderDocuments', "$expand=Document&$filter=OrderId eq '" + id + "' and OperationNo eq '" + operation_num + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMDocumentHeader:
            id = binding.WCMDocument;
            value = DocLib.getDocumentCount(controlProxy, 'WCMDocumentHeaderAttachments', "$expand=Document&$filter=WCMDocument eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMApproval:
            id = binding.WCMApproval;
            value = DocLib.getDocumentCount(controlProxy, 'WCMApprovalAttachments', "$expand=Document&$filter=WCMApproval eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMApplication:
            id = binding.WCMApplication;
            value = DocLib.getDocumentCount(controlProxy, 'WCMApplicationAttachments', "$expand=Document&$filter=WCMApplication eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMDocumentItem:
            value = GetWCMDocumentItemBDSCount(controlProxy, binding);
            break;
        case DocLib.ParentObjectType.S4ServiceOrder:
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceOrderDocuments', "$expand=Document&$filter=HeaderID eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceItem:
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceOrderDocuments', "$expand=Document&$filter=ObjectID eq '" + id + "' and ItemNo eq '" + item_num + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.InspectionLot:
            id = binding.InspectionLot;
            value = DocLib.getDocumentCount(controlProxy, 'InspectionLotDocuments', "$expand=Document&$filter=InspectionLot eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceRequest:
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceRequestDocuments', "$expand=Document&$filter=HeaderID eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceConfirmation:
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceConfirmationDocuments', "$expand=Document&$filter=HeaderID eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceConfirmationItem:
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceConfirmationDocuments', "$expand=Document&$filter=ObjectID eq '" + id + "' and ItemNo eq '" + item_num + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceQuotation:
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceQuotationDocuments', "$expand=Document&$filter=HeaderID eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceQuotationItem:
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceQuotationDocuments', "$expand=Document&$filter=ObjectID eq '" + id + "' and ItemNo eq '" + item_num + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.OnlineNotification:
            value = DocLib.getDocumentCount(controlProxy, 'NotifDocuments', "$filter=NotificationNumber eq '" + binding.NotificationNumber + "'", true);
            break;
        default:
            break;
    }
    return value;
}

function GetWCMDocumentItemBDSCount(context, wcmDocumentItem) {
    return DocLib.getDocumentCount(context, 'WCMDocumentItemAttachments', `$expand=Document&$filter=WCMDocument eq '${wcmDocumentItem.WCMDocument}' and WCMDocumentItem eq '${wcmDocumentItem.WCMDocumentItem}' and ${DocLib.getDocumentFilter()}`);
}
