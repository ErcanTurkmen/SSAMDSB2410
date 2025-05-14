/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionLotOperationHierarchyNav(context) {
    // workaround for MDK bug
    context.getPageProxy().setActionBinding({ ...context.getPageProxy().binding, HC_ROOT_CHILDCOUNT: 1});
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLotOperationHierarchy.action');
}
