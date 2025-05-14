import libCom from '../../Common/Library/CommonLibrary';

export default function ShowMaterialBatchField(context, calledFromFilter = false, bindingObject = undefined) {
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    let batchFlagForFilter = libCom.getStateVariable(context, 'BatchRequiredForFilterADHOC');
    const binding = bindingObject || context.binding;
    if (binding) {
        let plant;
        let material;
        let type = binding['@odata.type'].substring('#sap_mobile.'.length);
        let target = binding;

        //Find the record we are working with
        if (type === 'MaterialDocItem') {
            if (binding.PurchaseOrderItem_Nav) {
                target = binding.PurchaseOrderItem_Nav;
            } else if (binding.StockTransportOrderItem_Nav) {
                target = binding.StockTransportOrderItem_Nav;
                if (binding.StockTransportOrderItem_Nav.StockTransportOrderHeader_Nav) {
                    plant = binding.StockTransportOrderItem_Nav.StockTransportOrderHeader_Nav.SupplyingPlant;
                }
            } else if (binding.ReservationItem_Nav) {
                target = binding.ReservationItem_Nav;
            } else if (binding.InboundDeliveryItem_Nav) {
                target = binding.InboundDeliveryItem_Nav;
            } else if (binding.OutboundDeliveryItem_Nav) {
                target = binding.OutboundDeliveryItem_Nav;
            } else if (binding.ProductionOrderComponent_Nav) {
                target = binding.ProductionOrderComponent_Nav;
            } else if (binding.ProductionOrderItem_Nav) {
                target = binding.ProductionOrderItem_Nav;
            } else {
                plant = target.Plant;
            }
            material = binding.Material;
        } else if (type === 'StockTransportOrderItem') {
            plant = binding.StockTransportOrderHeader_Nav.SupplyingPlant;
            material = binding.MaterialNum;
        } else if (type === 'ProductionOrderComponent') {
            plant = target.SupplyPlant;
            material = target.MaterialNum;
        } else if (type === 'ProductionOrderItem') {
            plant = target.PlanningPlant;
            material = target.MaterialNum;
        }

        if (plant && material) {
            if ((objectType === 'STO' && move === 'I') || objectType === 'ADHOC' || objectType === 'PRD') { //Issuing an STO, so need to look up batch indicator manually instead of using nav link on the item that points to receiving plant
                let query = "MaterialPlants(MaterialNum='" + material + "',Plant='" + plant + "')";
                return context.read('/SAPAssetManager/Services/AssetManager.service', query, [], '').then(function(results) {
                    if (results && results.length > 0) {
                        let row = results.getItem(0);
                        if (row.BatchIndicator) {
                            return successBatchResult(context);
                        }
                    }
                    return false;
                }).catch(() => false);
            }
        }

        const {
            Material,
            MaterialPlant_Nav,
        } = target;


        if (MaterialPlant_Nav?.BatchIndicator ||
            (Material?.MaterialPlants?.length > 0 && Material.MaterialPlants[0].BatchIndicator) ||
            type === 'MaterialDocItem' && binding.Batch) {
            return successBatchResult(context);
        }
    } else if (objectType === 'ADHOC' && batchFlagForFilter && calledFromFilter) {
        return Promise.resolve(true);
    }

    return Promise.resolve(false);
}

function successBatchResult(context) {
    libCom.setStateVariable(context, 'BatchRequiredForFilterADHOC', true);
    return Promise.resolve(true);
}
