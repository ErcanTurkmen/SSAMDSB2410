import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function GetPurchaseOrderItemsOpenQuantitiesText(context, item, detailPage) {
    let binding = item || context.binding;
    let ordered = binding.OrderQuantity;
    let received = binding.ReceivedQuantity;
    let type = binding['@odata.type'].substring('#sap_mobile.'.length);
    let complete = false;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (type === 'StockTransportOrderItem') {
        if (allowIssue(binding)) { //Issue
            ordered = binding.OrderQuantity;
            received = binding.IssuedQuantity;
        } else { //Receipt
            ordered = binding.IssuedQuantity;
            received = binding.ReceivedQuantity;
            if (ordered === 0) { //STO case when nothing has been issued yet, but document shows up on receiving user's device
                return formatOpenQtyText(context, received, ordered, binding.OrderUOM, decimals);
            }
        }
    } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
        return getReservationItemOrProductionOrderText(binding, context, decimals, detailPage);
    } else if (type === 'PurchaseRequisitionItem') {
        const uom = binding.BaseUOM;
        const totalQtyStr = binding.ItemQuantity;
        return context.localizeText('pi_count_quantity', [totalQtyStr, uom]);
    }
    // PRD item has the same flow as PO, so no need in extra cases

    if (binding.DeliveryCompletedFlag || binding.FinalDeliveryFlag) {
        complete = true;
    }
    return getPurchaseOrderText(binding, complete, ordered, received, detailPage, decimals, context);
}

function formatOpenQtyText(context, openQty, totalQty, uom, decimals) {
    let openQtyStr = context.formatNumber(openQty, '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 });
    let totalQtyStr = context.formatNumber(totalQty, '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 });
    return context.localizeText('item_open_quantities', [openQtyStr, totalQtyStr, uom]);
}

function getPurchaseOrderText(binding, complete, ordered, received, detailPage, decimals, context) {
    if (ordered - received <= 0 || complete) {
        if (detailPage) {
            return formatOpenQtyText(context, received, ordered, binding.OrderUOM, decimals);
        }
        return context.localizeText('item_fully_posted');
    }
    return formatOpenQtyText(context, received, ordered, binding.OrderUOM, decimals);
}

function getReservationItemOrProductionOrderText(binding, context, decimals, detailPage) {
    let requiredQty = binding.RequirementQuantity;
    let withdrawalQty = binding.WithdrawalQuantity;
    if (requiredQty - withdrawalQty <= 0 || binding.Completed === 'X') {
        if (detailPage) {
            return formatOpenQtyText(context, withdrawalQty, requiredQty, binding.RequirementUOM, decimals);
        }
        return context.localizeText('item_fully_posted');
    }
    return formatOpenQtyText(context, withdrawalQty, requiredQty, binding.RequirementUOM, decimals);
}
