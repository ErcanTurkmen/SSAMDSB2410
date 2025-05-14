import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import PhaseLibrary from '../PhaseModel/PhaseLibrary';
import WorkOrderOperationsSelectAllButtonVisible from '../WorkOrders/Operations/WorkOrderOperationsSelectAllButtonVisible';
import WorkOrderOperationsDeselectAllButtonVisible from '../WorkOrders/Operations/WorkOrderOperationsDeselectAllButtonVisible';

export default async function IsAddOperationFromListEnabled(context) {
    const binding = context.binding;

    if (binding) {
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') { //Do not allow adding operations from work order detail operations list if order is phase enabled
            const phaseEnabled = await PhaseLibrary.isPhaseModelActiveInDataObject(context, binding);
            if (phaseEnabled) {
                return false;
            }
        }
    }

    const checksResult = await Promise.all([
        EnableWorkOrderEdit(context, binding),
        WorkOrderOperationsSelectAllButtonVisible(context),
        WorkOrderOperationsDeselectAllButtonVisible(context),
    ]);
    
    return checksResult[0] && !checksResult[1] && !checksResult[2];
}
