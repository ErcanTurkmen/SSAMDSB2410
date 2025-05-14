import EquipFuncLocListFilterResults from './EquipFuncLocListFilterResults';
import WorkOrdersListFilterResults from './WorkOrdersListFilterResults';

import libSearch from '../OnlineSearchLibrary';
import NotificationsListFilterResults from './NotificationsListFilterResults';

export default function OnlineSearchListFilterResults(context) {
    const activeTab = libSearch.getCurrentTabName(context);
    const workOrdersTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const notificationsTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();

    switch (activeTab) {
        case equipmentTabName:
        case funcLocTabName:
            return EquipFuncLocListFilterResults(context);
        case workOrdersTabName:
            return WorkOrdersListFilterResults(context);
        case notificationsTabName:
            return NotificationsListFilterResults(context);
        default:
            return [];
    }
}
