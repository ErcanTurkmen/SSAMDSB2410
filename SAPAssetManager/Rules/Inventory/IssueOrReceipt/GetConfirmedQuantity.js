import libCom from '../../Common/Library/CommonLibrary';
import ShowSerialNumberField from '../Validation/ShowSerialNumberField';

export default function GetConfirmedQuantity(context) {

    let binding = context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (binding) {
        let type = binding['@odata.type'].substring('#sap_mobile.'.length);
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let parent = libCom.getStateVariable(context, 'IMObjectType');
        let oldQuantity = 0;

        if (type.includes('DeliveryItem')) {
            return ShowSerialNumberField(context).then(show => {
                if (show) {
                    return binding.PickedQuantity;
                }

                return binding.Quantity;
            });
        }

        if (type === 'MaterialDocItem') { //Redirect binding to point to the underlying inventory object
            if (parent === 'REV') {
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
            } else {
                return Promise.resolve(context.formatNumber(Number(binding.EntryQuantity), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.EntryUOM);
            }
        }

        if (type === 'PurchaseOrderItem' || type === 'ProductionOrderItem') {
            return Promise.resolve(context.formatNumber(Number(binding.ReceivedQuantity) - oldQuantity, '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.OrderUOM);
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return Promise.resolve(context.formatNumber(Number(binding.ReceivedQuantity) - oldQuantity, '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.OrderUOM);
            }
            return Promise.resolve(context.formatNumber(Number(binding.IssuedQuantity) - oldQuantity, '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.OrderUOM); //Issue
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return Promise.resolve(context.formatNumber(Number(binding.WithdrawalQuantity) - oldQuantity, '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.RequirementUOM);
        } else if (type === 'Reversal') {
            return Promise.resolve(context.formatNumber(Number(binding.EntryQuantity) - oldQuantity, '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 }) + ' ' + binding.EntryUOM);
        }
    }
}

