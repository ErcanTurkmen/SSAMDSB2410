import libCom from '../../Common/Library/CommonLibrary';

export default function ShowSerialNumberField(context, bindingObject, selectedMovementType = '') {
    if (context.binding) {
        let plant;
        let material;
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let objectType = libCom.getStateVariable(context, 'IMObjectType');
        selectedMovementType = selectedMovementType || libCom.getListPickerValue(context.getPageProxy?.()?.getControl('FormCellContainer')?.getControl('MovementTypeLstPkr')?.getValue() || []);
        if (objectType === 'REV' && !selectedMovementType) {
            return Promise.resolve(false);
        }
        let target = context.binding;

        //Find the record we are working with
        const binding = bindingObject || context.binding;
        if ((type === 'MaterialDocItem' && objectType !== 'REV') || bindingObject) {
            if (binding.PurchaseOrderItem_Nav) {
                target = binding.PurchaseOrderItem_Nav;
            } else if (binding.StockTransportOrderItem_Nav) {
                target = binding.StockTransportOrderItem_Nav;
                plant = binding.StockTransportOrderItem_Nav.StockTransportOrderHeader_Nav.SupplyingPlant;
            } else if (binding.ReservationItem_Nav) {
                target = binding.ReservationItem_Nav;
            } else if (binding.ProductionOrderComponent_Nav && libCom.getStateVariable(context, 'MaterialDocNumberBulkUpdate')) {
                target = binding.ProductionOrderComponent_Nav;
            }
            material = binding.Material;
        } else if (type === 'StockTransportOrderItem') {
            plant = binding.StockTransportOrderHeader_Nav.SupplyingPlant;
            material = binding.MaterialNum;
        }

        if (plant && material) {
            if (objectType === 'STO' && move === 'I') { //Issuing an STO, so need to look up serial profile manually instead of using nav link on the item that points to receiving plant
                let query = "MaterialPlants(MaterialNum='" + material + "',Plant='" + plant + "')";
                return context.read('/SAPAssetManager/Services/AssetManager.service', query, [], '').then(function(results) {
                    if (results && results.length > 0) {
                        let row = results.getItem(0);
                        if (row.SerialNumberProfile) {
                            return true;
                        }
                    }
                    return false;
                });
            }
        }

        const {
            Material,
            MaterialPlant_Nav,
            SerialNum,
        } = target;

        if (MaterialPlant_Nav?.SerialNumberProfile ||
            (Material?.MaterialPlants?.length > 0 && Material.MaterialPlants[0].SerialNumberProfile) ||
            SerialNum?.length > 0) {
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}
