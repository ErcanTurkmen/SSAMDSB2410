import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderOperationListViewCaption from './WorkOrderOperationListViewCaption';
import { redrawToolbar } from '../../Common/DetailsPageToolbar/ToolbarRefresh';

export default function DeselectAllOperations(context) {
    libCommon.setStateVariable(context, 'selectAllActive', false, 'WorkOrderOperationsListViewPage');
    const pageProxy = context.getPageProxy();
    const table = pageProxy.getControls()[0].getSections()[0];
    table.deselectAllItems();

    libCommon.setStateVariable(context, 'selectedOperations', []);
    libCommon.removeStateVariable(context, 'removedOperations');

    redrawToolbar(pageProxy);

    pageProxy.setActionBarItemVisible('SelectAll', true);
    pageProxy.setActionBarItemVisible('DeselectAll', false);

    return WorkOrderOperationListViewCaption(context).then(caption => {
        return pageProxy.setCaption(caption);
    });
}
