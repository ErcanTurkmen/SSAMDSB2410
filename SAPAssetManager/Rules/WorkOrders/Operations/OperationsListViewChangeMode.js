import { redrawToolbar } from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import ToolbarUpdateVisibility from '../../Common/DetailsPageToolbar/ToolbarUpdateVisibility';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function OperationsListViewChangeMode(context) {
    CommonLibrary.setStateVariable(context, 'OperationsToSelectCount', undefined);
    CommonLibrary.setStateVariable(context, 'selectedOperations', []);
    
    let pageProxy = context.getPageProxy();
    let toolbarVisible = false;
    if (pageProxy.getControl('SectionedTable').getSections()[0].getSelectionMode() !== 'Multiple') {
        pageProxy.getControl('SectionedTable').getSections()[0].setSelectionMode('Multiple');
        toolbarVisible = true;
    } else {
        pageProxy.getControl('SectionedTable').getSections()[0].setSelectionMode('None');
    }

    return redrawSelectionList(context, toolbarVisible);
}

export function redrawSelectionList(context, toolbarVisible) {
    let pageProxy = context.getPageProxy();

    CommonLibrary.setStateVariable(context, 'firstOpenMultiSelectMode', false);
    CommonLibrary.setStateVariable(context, 'selectAllActive', false, 'WorkOrderOperationsListViewPage');

    pageProxy._page._redrawActionBar();

    pageProxy.showActivityIndicator();
    return pageProxy.getControl('SectionedTable').redraw().finally(() => {
        pageProxy.dismissActivityIndicator();
        ToolbarUpdateVisibility(pageProxy, toolbarVisible);
        redrawToolbar(pageProxy);
    });
}
