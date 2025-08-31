import IsSupervisorSectionVisibleForOperations from './IsSupervisorSectionVisibleForOperations';
import IsAndroid from '../../Common/IsAndroid';
import WorkOrderOperationsSelectAllButtonVisible from '../../WorkOrders/Operations/WorkOrderOperationsSelectAllButtonVisible';
import WorkOrderOperationsDeselectAllButtonVisible from '../../WorkOrders/Operations/WorkOrderOperationsDeselectAllButtonVisible';

export default async function IsSupervisorSectionVisibleForOperationsForAndroid(context) {
    if (IsAndroid(context)) {
        const checksResult = await Promise.all([
            IsSupervisorSectionVisibleForOperations(context),
            WorkOrderOperationsSelectAllButtonVisible(context),
            WorkOrderOperationsDeselectAllButtonVisible(context),
        ]);
        return checksResult[0] && !checksResult[1] && !checksResult[2];
    }

    return false;
}
