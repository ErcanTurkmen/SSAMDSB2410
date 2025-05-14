import DocLib from '../Documents/DocumentLibrary';

export default function OperationNo(controlProxy) {
    let value = controlProxy.binding['@odata.readLink'];
    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            return '0';
        case DocLib.ParentObjectType.Notification:
            return '0';
        case DocLib.ParentObjectType.Equipment:
            return '0';
        case DocLib.ParentObjectType.FunctionalLocation:
            return '0';
        case DocLib.ParentObjectType.Operation:
            value += ':OperationNo';
            return '<' + value + '>';
        case DocLib.ParentObjectType.S4ServiceItem:
        case DocLib.ParentObjectType.S4ServiceQuotationItem:       
            value += ':ItemNo';
            return '<' + value + '>';
        default:
            return '0';
    }
}
