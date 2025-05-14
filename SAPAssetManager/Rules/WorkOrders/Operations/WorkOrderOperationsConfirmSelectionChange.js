import { redrawToolbar } from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import common from '../../Common/Library/CommonLibrary';

/**
* Selection change reaction
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderOperationsConfirmSelectionChange(clientAPI) {
    const tableSection = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const item = tableSection.getSelectionChangedItem();
    let selectedItems = common.getStateVariable(clientAPI, 'selectedOperationConfirmations') || [];
    const itemBinding = item.binding;
    if (item.selected && itemBinding) {
        selectedItems.push(itemBinding);
    } else if (itemBinding) {
        selectedItems = selectedItems.filter(readlink => readlink['@odata.readLink'] !== itemBinding['@odata.readLink']);
    }
    common.setStateVariable(clientAPI, 'selectedOperationConfirmations', selectedItems);
    redrawToolbar(clientAPI.getPageProxy());
}
