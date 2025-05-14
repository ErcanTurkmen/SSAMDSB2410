import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function GetPOItemState(clientAPI, item) {
    let binding = item || clientAPI.getPageProxy().getClientData().item || clientAPI.getBindingObject();
    let received = binding.ReceivedQuantity;
    let ordered = binding.OrderQuantity;

    /**
     * RS items and PRD components have Completed property. Item is full if completed = 'X'.
     * PO and STO items have both have two properties called DeliveryCompletedFlag and FinalDeliveryFlag.
     * If either of the flags equals 'X' then the item is considered completed.
     */
    if (binding.DeliveryCompletedFlag === 'X' || binding.FinalDeliveryFlag === 'X' || binding.Completed === 'X') {
        return clientAPI.localizeText('completed');
    }

    //For STO items only
    let type = binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'StockTransportOrderItem') {
        let issued = binding.IssuedQuantity;
        if (allowIssue(binding)) {
            return getStockTransportOrderState(clientAPI, ordered, issued);
        } else {
            ordered = binding.IssuedQuantity;
        }
    } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
        let requiredQty = binding.RequirementQuantity;
        let withdrawalQty = binding.WithdrawalQuantity;
        return getReservationItemState(clientAPI, requiredQty, withdrawalQty);
    } else if (type === 'PurchaseRequisitionItem') {
        return clientAPI.localizeText('open');
    }

    //For PO and PRD items and received STO items. Not for issued STO items.
    if (ordered === 0 || received === 0) {
        return clientAPI.localizeText('open');
    }

    //For PO and PRD items and received STO items. Not for issued STO items.
    if (ordered - received > 0) {
        return clientAPI.localizeText('item_partial');
    }

    //For PO and PRD items and received STO items. Not for issued STO items.
    return clientAPI.localizeText('completed');
}

function getStockTransportOrderState(clientAPI, ordered, issued) {
    if (ordered === 0 || issued === 0) {
        return clientAPI.localizeText('open');
    } else if (ordered - issued > 0) {
        return clientAPI.localizeText('item_partial');
    } else {
        return clientAPI.localizeText('completed');
    }
}

function getReservationItemState(clientAPI, requiredQty, withdrawalQty) {
    if (requiredQty === 0 || withdrawalQty === 0) {
        return clientAPI.localizeText('open');
    } else if (requiredQty - withdrawalQty > 0) {
        return clientAPI.localizeText('item_partial');
    } else {
        return clientAPI.localizeText('completed');
    }
}
