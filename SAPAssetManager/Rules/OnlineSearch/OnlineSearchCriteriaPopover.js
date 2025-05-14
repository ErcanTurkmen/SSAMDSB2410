/**
* Opens corresponding Search Criteria page based on active tab
* @param {IClientAPI} context
*/

export default function OnlineSearchCriteriaPopover(context) {
    const activeTab = context.getControls()[0].getSelectedTabItemName();
    const workOrdersTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const notificationsTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();

    switch (activeTab) {
        case equipmentTabName:
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/OnlineSearchCriteriaEquipment.action');
        case funcLocTabName:
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/OnlineSearchCriteriaFunctionalLocation.action');
        case workOrdersTabName:
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/OnlineSearchCriteriaWorkOrders.action');
        case notificationsTabName:
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/OnlineSearchCriteriaNotifications.action');
        default:
            return null;
    }
}
