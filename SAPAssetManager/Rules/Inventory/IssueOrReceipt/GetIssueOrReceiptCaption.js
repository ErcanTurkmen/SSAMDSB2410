import libCom from '../../Common/Library/CommonLibrary';

export default function GetIssueOrReceiptCaption(context) {

    //Get the screen caption for receipt or issue create/edit
    const movemnetType = libCom.getStateVariable(context, 'IMMovementType');
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const isShowItemNum = type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem' || type === 'ReservationItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem';
    let result = '';

    if (movemnetType === 'R') {
        if (objectType === 'IB' || objectType === 'OB') {
            result = '$(L,delivery_item_title)';
        } else if (objectType === 'ADHOC') {
            result = '$(L, add_goods_receipt)';
        } else if (objectType === 'PO' || objectType === 'STO') {
            result = '$(L,po_item_receiving_title)';
        }
    } else if (movemnetType === 'I') {
        result = handleIMovementType(objectType);
    } else if (movemnetType === 'T') {
        result = handleTMovementType(objectType);
    } else if (objectType === 'REV') {
        result = '$(L,item_reversing_title)';
    }
      
    if (result && isShowItemNum) {
        const item = context.binding.ItemNum || context.binding.Item;
        result += ' - ' + item;
    }

    return result;
}

function handleIMovementType(objectType) {
    let result = '';
    switch (objectType) {
        case 'TRF':
            result = '$(L,stock_transfer)';
            break;
        case 'IB':
        case 'OB':
            result = '$(L,delivery_item_title)';
            break;
        case 'ADHOC':
            result = '$(L, add_goods_issue)';
            break;
        case 'PRD':
            result = '$(L, issue_component)';
            break;
        default:
            result = '$(L,issue_item)';
    }
    return result;
}

function handleTMovementType(objectType) {
    if (objectType === 'ADHOC') {
        return '$(L,stock_transfer)';
    }
    return '';
}

