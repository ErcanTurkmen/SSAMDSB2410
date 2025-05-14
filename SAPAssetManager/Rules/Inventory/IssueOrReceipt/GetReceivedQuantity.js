import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function GetReceivedQuantity(context) {

    let type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let parent = libCom.getStateVariable(context, 'IMObjectType');
    let binding = context.binding;
    if (binding) {
        if (type === 'MaterialDocItem') {
            //Get from associated PO/STO/RESV line item
            return handleMaterialDocItem(binding, parent, context);
        } else if (type === 'ProductionOrderItem') {
            return libLocal.toNumber(context, Number(binding.OrderQuantity) - Number(binding.ReceivedQuantity));
        } else if (type === 'PurchaseOrderItem') {
            return libLocal.toNumber(context, Number(binding.OpenQuantity));
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return libLocal.toNumber(context, Number(binding.IssuedQuantity) - Number(binding.ReceivedQuantity));
            }
            return libLocal.toNumber(context, Number(binding.OrderQuantity) - Number(binding.IssuedQuantity)); //Issue
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return libLocal.toNumber(context, Number(binding.RequirementQuantity) - Number(binding.WithdrawalQuantity));
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return handleDeliveryItem(binding, context);
        }
    }

    return 0;
}

function handleDeliveryItem(binding, context) {
    if (Number(binding.PickedQuantity) > 0) {
        return libLocal.toNumber(context, binding.PickedQuantity);
    }
    return libLocal.toNumber(context, binding.Quantity);
}

function handleMaterialDocItem(binding, parent, context) {
    const entryQuantity = binding.EntryQuantity;
    let isLocal = libCom.isCurrentReadLinkLocal(binding['@odata.readLink']);
    if (!isLocal) {
        if (parent === 'REV') {
            return libLocal.toNumber(context, entryQuantity);
        }
    }
    return libLocal.toNumber(context, binding.EntryQuantity);
}
