import common from '../../../Common/Library/CommonLibrary';
import enableMaintenanceTechnician from '../../../SideDrawer/EnableMaintenanceTechnician';
import GetPlantName from '../../PurchaseOrder/GetPlantName';
import getBatch from '../GetBatch';
import isInventoryClerk from '../../../SideDrawer/EnableInventoryClerk';

export default function GetValuationType(context, bindingObject) {
    let binding = bindingObject || context.binding;
    if (binding) {
        let material = binding.Material || binding.MaterialNum;
        let plant;
        if (isInventoryClerk(context)) {
            plant = GetPlantName(context, binding);
        } else {
            plant = binding.Plant || binding.SupplyPlant || binding.PlanningPlant;
        }
        let batch = getBatch(context, binding);
        if (enableMaintenanceTechnician(context)) {
            material = binding.MaterialNum;
            batch = binding.Batch;
        }
        let isLocal = common.isCurrentReadLinkLocal(binding['@odata.readLink']);
        if (isLocal) {
            if (binding.ValuationType) {
                return binding.ValuationType;
            } else if (binding.RelatedItem && binding.RelatedItem[0].ValuationType) {
                return binding.RelatedItem[0].ValuationType;
            }
        }
        let plantNav = binding.MaterialPlant_Nav;
        if (plantNav) {
            return setValuationType(context, plantNav, material, batch, binding);
        } else if (plant && material) {
            let query = `$filter=Plant eq '${plant}' and MaterialNum eq '${material}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query).then((data) => {
                if (data.length === 1) {
                    let item = data.getItem(0);
                    return setValuationType(context, item, material, batch, binding);
                }
                return '';
            });
        }
    }
    return '';
}

function setValuationType(context, plantNav, material, batch, binding) {
    let type = binding['@odata.type'].substring('#sap_mobile.'.length);
    const isCategoryExist = checkIsCategoryExist(plantNav, type);

    if (isCategoryExist) {
        return batch;
    } else if (plantNav.ValuationCategory && plantNav.BatchIndicator) {
        if (batch && material) {
            let query = `$filter=Batch eq '${batch}' and MaterialNum eq '${material}' and Plant eq '${plantNav.Plant}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialBatches', [], query).then((data) => {
                if (data.length === 1) {
                    let item = data.getItem(0);
                    return item.ValuationType;
                }
                return '';
            });
        }
    }
    const hasRelatedItem = getHasRelatedItem(binding);
    if (plantNav.ValuationCategory || binding.ValuationCategory) {
        if (binding.ValuationType) {
            return binding.ValuationType;
        } else if (hasRelatedItem) {
            return binding.RelatedItem[0].ValuationType;
        }
    }
    return '';
}

function checkIsCategoryExist(plantNav, type) {
    return plantNav.ValuationCategory && !plantNav.BatchIndicator && (type === 'ReservationItem' || type === 'ProductionOrderComponent' || type === 'MyWorkOrderComponent');
}

function getHasRelatedItem(binding) {
    return binding.RelatedItem && binding.RelatedItem[0].ValuationType;
}
