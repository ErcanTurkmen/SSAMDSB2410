import libCom from '../../Common/Library/CommonLibrary';
import GetConfirmedQuantity from './GetConfirmedQuantity';
export default function GetRequestedQuantity(context) {
    let binding;
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let parent = libCom.getStateVariable(context, 'IMObjectType');

        if (type === 'MaterialDocItem') { //Redirect binding to point to the underlying inventory object
            const values = getBinding(context, parent);
            binding = values.binding;
            type = values.type;
        } else {
            binding = context.binding; //Use the inventory object we already have
        }
        return getQuantity(context, type, binding, move);
    }
    return '0';
}

function getQuantity(context, type, binding, move) {
    let ConfirmedQty = '';
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    return GetConfirmedQuantity(context).then(ConfirmedQtyUOM => {
        if (type.includes('DeliveryItem')) {
            ConfirmedQty = ConfirmedQtyUOM;
        } else {
            ConfirmedQty = ConfirmedQtyUOM.split(' ')[0];
        }
        if (type === 'PurchaseOrderItem' || type === 'ProductionOrderItem') {
            return (ConfirmedQty + ' / ' + context.formatNumber(Number(binding.OrderQuantity), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.OrderUOM);
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return (ConfirmedQty + ' / ' + context.formatNumber(Number(binding.IssuedQuantity), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.OrderUOM);
            }
            return (ConfirmedQty + ' / ' + context.formatNumber(Number(binding.OrderQuantity), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.OrderUOM); //Issue
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return (ConfirmedQty + ' / ' + context.formatNumber(Number(binding.RequirementQuantity), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.RequirementUOM);
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return (ConfirmedQty + ' / ' + context.formatNumber(Number(binding.Quantity), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.UOM);
        } else if (type === 'Reversal') {
            return (ConfirmedQty + ' / ' + context.formatNumber(Number(binding.EntryQuantity), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.EntryUOM);
        }
        if (ConfirmedQty) {
            return ConfirmedQtyUOM;
        } else {
            return '0';
        }

    });

}

function getBinding(context, parent) {
    let binding;
    let type = 'MaterialDocItem';
    if (parent === 'REV') {
        binding = context.binding;
        type = 'Reversal';
    } else if (context.binding.PurchaseOrderItem_Nav) {
        binding = context.binding.PurchaseOrderItem_Nav;
        type = 'PurchaseOrderItem';
    } else if (context.binding.StockTransportOrderItem_Nav) {
        binding = context.binding.StockTransportOrderItem_Nav;
        type = 'StockTransportOrderItem';
    } else if (context.binding.ReservationItem_Nav) {
        binding = context.binding.ReservationItem_Nav;
        type = 'ReservationItem';
    } else if (context.binding.ProductionOrderComponent_Nav) {
        binding = context.binding.ProductionOrderComponent_Nav;
        type = 'ProductionOrderComponent';
    } else if (context.binding.ProductionOrderItem_Nav) {
        binding = context.binding.ProductionOrderItem_Nav;
        type = 'ProductionOrderItem';
    }
    return { binding, type };
}
