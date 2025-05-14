import EquipmentSearchCriteriaValidation from '../Equipment/EquipmentSearchCriteriaValidation';
import FuncLocSearchCriteriaValidation from '../FuncLoc/FuncLocSearchCriteriaValidation';
import WorkOrdersSearchCriteriaValidation from '../WorkOrders/WorkOrdersSearchCriteriaValidation';
import NotificationsSearchCriteriaValidation from '../Notifications/NotificationsSearchCriteriaValidation';
import libSearch from '../OnlineSearchLibrary';

export default function SearchCriteriaValidation(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    const activeTab = libSearch.getCurrentTabName(context);
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();
    const workOrdersTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const notificationsTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();

    switch (activeTab) {
        case equipmentTabName:
            return EquipmentSearchCriteriaValidation(context);
        case funcLocTabName:
            return FuncLocSearchCriteriaValidation(context);
        case workOrdersTabName:
            return WorkOrdersSearchCriteriaValidation(context);
        case notificationsTabName:
            return NotificationsSearchCriteriaValidation(context);
        default:
            return null;
    }
}
