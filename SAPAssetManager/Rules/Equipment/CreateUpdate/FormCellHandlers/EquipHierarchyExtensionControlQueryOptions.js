import maintenancePlant from '../../../HierarchyControl/MaintenancePlantForEquipment';
export default function EquipHierarchyExtensionControlQueryOptions(controlProxy) {
    let result = '$orderby=EquipId';
    let maintPlant = maintenancePlant(controlProxy);
    if (maintPlant) {
        result += `&$filter=(MaintPlant eq '${maintPlant}')`;
    }
    return Promise.resolve(result);
}
