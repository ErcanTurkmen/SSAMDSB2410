export default function WarehouseFooterDetails(context) {
const processtype = context.binding.WOProcessType;
const activityArea = context.binding.ActivityArea;
const warehouseProcessTypeNavigation = context.binding.WarehouseProcessType_Nav;
    if (processtype && warehouseProcessTypeNavigation) {
        return `${activityArea}, ${warehouseProcessTypeNavigation.WarehouseProcessTypeDescription}`;
    }
    return activityArea;
}

