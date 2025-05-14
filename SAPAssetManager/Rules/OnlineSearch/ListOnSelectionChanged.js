import { redrawToolbar } from '../Common/DetailsPageToolbar/ToolbarRefresh';
import libCommon from '../Common/Library/CommonLibrary';

/**
* Updates selectedItems list when item is selected/deselected and also updates buttons visibility
* @param {IClientAPI} context
*/
export default function ListOnSelectionChanged(context) {
    let onlineSearchPageProxy = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
    let tableProxy = context.getSections()[0];
    let item = tableProxy.getSelectionChangedItem();
    let selectedItems = libCommon.getStateVariable(context, 'selectedItems') || [];

    if (item.selected) {
        selectedItems.push(item);
    } else if (item.binding) {
        selectedItems = selectedItems.filter(i => {
            if (i.binding) {
                return i.binding['@odata.readLink'] !== item.binding['@odata.readLink'];
            }
            return false;
        });
    }

    libCommon.setStateVariable(context, 'selectedItems', selectedItems);

    const isAnySelected = !!selectedItems.length;
    onlineSearchPageProxy.setActionBarItemVisible('DeselectAll', isAnySelected);
    onlineSearchPageProxy.setActionBarItemVisible('SelectAll', !isAnySelected);

    redrawToolbar(onlineSearchPageProxy);
}
