import common from '../../Common/Library/CommonLibrary';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
/**
 * This function returns the plant object header field on PurchaseOrderItemDetails page
 */
export default function GetPlantName(context, bindingObject) {
    const binding = bindingObject || context.binding;
    let plantVar = common.getStateVariable(context, 'CurrentDocsItemsPlant');
    let type;

    if (binding) {
        type = binding['@odata.type'].substring('#sap_mobile.'.length);
        let plant = '';

        if (type === 'MaterialDocItem' || type === 'PurchaseOrderItem' || type === 'MaterialSLoc' || type === 'PhysicalInventoryDocItem') {
            plant = binding.Plant;
        } else if (type === 'StockTransportOrderItem') {
            plant = getPlantForStockTransportOrderItem(binding);
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            plant = binding.SupplyPlant;
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            plant = binding.Plant;
        } else if (type === 'ProductionOrderItem') {
            plant = binding.PlanningPlant;
        }
        return plant;
    }
    if (plantVar) {
        return plantVar;
    }
    let defaultValue = common.getUserDefaultPlant();
    return defaultValue || '';
}

function getPlantForStockTransportOrderItem(binding) {
    if (allowIssue(binding)) { //Issue so use supply plant
        return binding.StockTransportOrderHeader_Nav.SupplyingPlant;
    }
    return binding.Plant;
}
