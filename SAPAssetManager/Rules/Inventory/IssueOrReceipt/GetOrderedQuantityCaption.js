import libCom from '../../Common/Library/CommonLibrary';
import { InventoryOrderTypes } from '../Common/Library/InventoryLibrary';
export default function GetOrderedQuantityCaption(context) {

    const type = libCom.getStateVariable(context, 'IMObjectType');
    const move = libCom.getStateVariable(context, 'IMMovementType');
    let confirmedQty = '';
    let orderedQty = '';
    if (type in InventoryOrderTypes) {
        confirmedQty = context.localizeText('confirmed_filter');
    }
    if (type === 'PO' || type === 'STO' || (type === 'PRD' && move === 'R') || type === 'REV') {
        orderedQty = context.localizeText('po_item_detail_requested');
    } else if (type === 'RES' || (type === 'PRD' && move === 'I')) {
        orderedQty = context.localizeText('reservation_item_requirement_qty');
    } else if (type === 'IB' || type === 'OB') {
        orderedQty = context.localizeText('delivery_quatity');
    }
    if (confirmedQty) {
        return context.localizeText('conf_ord_quan', [confirmedQty, orderedQty]);
    } else {
        return orderedQty;
    }
}
