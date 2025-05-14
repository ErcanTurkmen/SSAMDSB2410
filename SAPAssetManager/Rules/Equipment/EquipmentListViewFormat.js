import { EquipmentLibrary as EquipmentLib } from './EquipmentLibrary';
import {ValueIfExists} from '../Common/Library/Formatter';
import { LRUCache } from '../HierarchyControl/ChildCountListPicker';

/**
 * Rule used to display the various properties on the equipment list view row.
 * @see EquipmentLibrary
 */
export default function EquipmentListViewFormat(context) {
    let pageProxy = context.getPageProxy();
    let clientData = pageProxy && pageProxy.getClientData ? pageProxy.getClientData() : {};
    let section = context.getName();
    let property = context.getProperty();
    let value = '';
    let cachedPlant;

    switch (section) {
        case 'ObjectListEquipmentViewSection':
        case 'EquipmentListViewSection':
        case 'WorkApprovalEquipmentSection':
            switch (property) {
                case 'Subhead':
                    if (!clientData.PlantsCache) {
                        clientData.PlantsCache = new LRUCache(25);
                    }
                    cachedPlant = clientData.PlantsCache.get(context.binding.PlanningPlant);
                    value = getSubheadValue(context, cachedPlant, clientData);
                    break;
                case 'SubstatusText':
                        //Display equipment status text.
                    value = EquipmentLib.getStatusDescription(context, false);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return value;
}

function formatPlantDisplayValue(context, plant = '-') {
    if (plant && plant !== '-') {
        return ValueIfExists(context.binding.WorkCenter_Main_Nav, `${plant.PlantDescription} (${context.binding.PlanningPlant})`, function(workcenter) {
            return `${plant.PlantDescription} (${context.binding.PlanningPlant}), ${workcenter.ExternalWorkCenterId}`;
        });
    } else {
        return plant;
    }
}

function getSubheadValue(context, cachedPlant, clientData) {
    if (cachedPlant !== null) {
        return Promise.resolve(formatPlantDisplayValue(context, cachedPlant));
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${context.binding.PlanningPlant}')`, [], '').then(function(result) {
            let plant = result.length > 0 ? result.getItem(0) : '';
            clientData.PlantsCache.set(context.binding.PlanningPlant, plant);
            return formatPlantDisplayValue(context, plant);
        });
    }
}
