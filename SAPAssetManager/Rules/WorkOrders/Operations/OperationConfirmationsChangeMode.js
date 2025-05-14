import { redrawToolbar } from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import ToolbarUpdateVisibility from '../../Common/DetailsPageToolbar/ToolbarUpdateVisibility';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import WorkOrderOperationConfirmCaption from './WorkOrderOperationConfirmCaption';

export default function OperationsConfirmationsChangeMode(context) {
    CommonLibrary.setStateVariable(context, 'selectedOperationConfirmations', []);
    let pageProxy = context.getPageProxy();

    const isMultipleMode = pageProxy.getControl('SectionedTable').getSections()[0].getSelectionMode() !== 'Multiple';
    if (isMultipleMode) {
        pageProxy.getControl('SectionedTable').getSections()[0].setSelectionMode('Multiple');
    } else {
        pageProxy.getControl('SectionedTable').getSections()[0].setSelectionMode('None');
    }

    pageProxy.setActionBarItemVisible('ConfirmItems', !isMultipleMode);
    pageProxy.setActionBarItemVisible('SelectToRemove', !isMultipleMode);
    return redrawSelectConfirmationsList(context, isMultipleMode).finally(() => {
        context.setCaption(WorkOrderOperationConfirmCaption(context));
    });
}

export function redrawSelectConfirmationsList(context, toolbarVisible) {
    let pageProxy = context.getPageProxy();
    const tableSection = pageProxy.getControls()[0].getSections()[0];

    return tableSection.redraw().finally(() => {
        ToolbarUpdateVisibility(pageProxy, toolbarVisible);
        redrawToolbar(pageProxy);
    });
}
