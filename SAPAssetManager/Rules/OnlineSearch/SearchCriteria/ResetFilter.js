import libCom from '../../Common/Library/CommonLibrary';
import libSearch from '../OnlineSearchLibrary';
import FilterReset from '../../Filter/FilterReset';

/**
* Clears client data properties that were set for simple property controls default values and resets filter
* @param {IControlProxy} control
*/
export default function ResetFilter(control) {
    const pageProxy = control.getPageProxy();
    const activeTab = libSearch.getCurrentTabName(control);
    const workOrdersTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    const controlNames = libSearch.getSimplePropertyControls(pageProxy).map(c => c.getName());
    libCom.removeStateVariable(pageProxy, controlNames, 'OnlineSearchEquipmentList');
    libCom.removeStateVariable(pageProxy, controlNames, 'OnlineSearchFuncLocList');
    libCom.removeStateVariable(pageProxy, controlNames, 'OnlineSearchWorkOrdersList');
    libCom.removeStateVariable(pageProxy, controlNames, 'OnlineSearchNotificationsList');
    FilterReset(control);
    if (workOrdersTabName === activeTab) {
        let clientData = pageProxy.evaluateTargetPath('#Page:OnlineSearchWorkOrdersList/#ClientData');
        clientData.StartDateSwitch = undefined;
        clientData.AssignFilterButtons = undefined;
    }
}
