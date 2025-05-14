import { redrawToolbar } from '../Common/DetailsPageToolbar/ToolbarRefresh';
import libCom from '../Common/Library/CommonLibrary';
import libSearch from './OnlineSearchLibrary';

export default async function SelectAllItems(context) {
    const pageProxy = libSearch.getCurrentTabPage(context);
    const table = pageProxy.getControls()[0].getSections()[0];
    table.selectAllItems();

    context.showActivityIndicator();
    //manually add all items to the array
    let selectedItems = await libSearch.readAllRecords(pageProxy, table);
    libCom.setStateVariable(context, 'selectedItems', selectedItems);
    context.dismissActivityIndicator();

    redrawToolbar(context);

    context.setActionBarItemVisible('SelectAll', false);
    context.setActionBarItemVisible('DeselectAll', true);
}
