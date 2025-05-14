import libDocument from './DocumentLibrary';

export default function DocumentFilter(context) {
    let id = '';
    let year = '';
    let operation_num = '';
    let filter = '';
    const docFilter = libDocument.getDocumentFilter();

    switch (libDocument.lookupParentObjectType(context, context.getPageProxy().binding['@odata.type'])) {
        case libDocument.ParentObjectType.WorkOrder:
            id = context.getPageProxy().binding.OrderId;
            filter = "OrderId eq '" + id + "' and (OperationNo eq null or OperationNo eq '')";
            break;
        case libDocument.ParentObjectType.MaterialDocument:
            id = context.getPageProxy().binding.MaterialDocNumber;
            year = context.getPageProxy().binding.MaterialDocYear;
            filter = "MaterialDoc eq '" + id + "' and MatDocYear eq '" + year + "'";
            break;
        case libDocument.ParentObjectType.Notification:
            id = context.getPageProxy().binding.NotificationNumber;
            filter = "NotificationNumber eq '" + id + "'";
            break;
        case libDocument.ParentObjectType.Equipment:
            id = context.getPageProxy().binding.EquipId;
            filter = "EquipId eq '" + id + "'";
            break;
        case libDocument.ParentObjectType.FunctionalLocation:
            id = context.getPageProxy().binding.FuncLocIdIntern;
            filter = "FuncLocIdIntern eq '" + id + "'";
            break;
        case libDocument.ParentObjectType.Operation:
            id = context.getPageProxy().binding.OrderId;
            operation_num = context.getPageProxy().binding.OperationNo;
            filter = "OrderId eq '" + id + "' and OperationNo eq '" + operation_num + "'";
            break;
        case libDocument.ParentObjectType.InspectionLot:
            id = context.getPageProxy().binding.InspectionLot;
            filter = "InspectionLot eq '" + id + "'";
            break;
        case libDocument.ParentObjectType.S4ServiceQuotation:
        case libDocument.ParentObjectType.S4ServiceOrder:
        case libDocument.ParentObjectType.S4ServiceRequest:
            id = context.getPageProxy().binding.ObjectID;
            filter = "HeaderID eq '" + id + "'";
            break;
        case libDocument.ParentObjectType.S4ServiceQuotationItem:    
        case libDocument.ParentObjectType.S4ServiceItem:
            id = context.getPageProxy().binding.ObjectID;
            operation_num = context.getPageProxy().binding.ItemNo;
            filter = "ObjectID eq '" + id + "' and ItemNo eq '" + operation_num + "'";
            break;
        case libDocument.ParentObjectType.S4ServiceConfirmation:
            id = context.getPageProxy().binding.ObjectID;
            filter = "HeaderID eq '" + id + "'";
            break;  
    }

    return filter ? filter + ' and ' + docFilter : docFilter;
}
