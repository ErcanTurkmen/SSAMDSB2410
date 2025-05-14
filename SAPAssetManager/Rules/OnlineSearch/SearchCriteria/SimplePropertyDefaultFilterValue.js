import libSearch from '../OnlineSearchLibrary';

/**
* Get default value from client data based on control name
* @param {IControlProxy} control
*/
export default function SimplePropertyDefaultFilterValue(control) {
    const activeTab = libSearch.getCurrentTabName(control);
    const equipmentTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();
    const workOrdersTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const notificationsTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();

    switch (activeTab) {
        case equipmentTabName:
            return libSearch.getFilterDefaultValue(control, 'OnlineSearchEquipmentList');
        case funcLocTabName:
            return libSearch.getFilterDefaultValue(control, 'OnlineSearchFuncLocList');
        case workOrdersTabName:
            return libSearch.getFilterDefaultValue(control, 'OnlineSearchWorkOrdersList');
        case notificationsTabName:
            return libSearch.getFilterDefaultValue(control, 'OnlineSearchNotificationsList');
        default:
            return '';
    }
}
