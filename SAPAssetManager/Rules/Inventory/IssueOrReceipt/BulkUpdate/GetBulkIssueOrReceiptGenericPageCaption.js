import libCom from '../../../Common/Library/CommonLibrary';
import { InventoryOrderTypes } from '../../Common/Library/InventoryLibrary';

export default function GetBulkIssueOrReceiptGenericPageCaption(context) {
    const movementType = libCom.getStateVariable(context, 'IMMovementType');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    if (movementType === 'R' && objectType === InventoryOrderTypes.PO) {
        return context.binding.PurchaseOrderId;
    } else if (movementType === 'I') {
        if (objectType === InventoryOrderTypes.RES) {
            return context.binding.ReservationNum;
        } else if (objectType === InventoryOrderTypes.PRD) {
            return context.binding.OrderId;
        } else if (objectType === InventoryOrderTypes.STO) {
            return context.binding.StockTransportOrderId;
        }  
    } 
    return '';
}
