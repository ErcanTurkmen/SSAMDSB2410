import ConfirmationOrItemStatusUpdateSequenceClass from '../Confirmations/Details/ConfirmationOrItemStatusUpdateSequenceClass';
import OperationStatusUpdateSequenceClass from '../Operations/MobileStatus/OperationStatusUpdateSequenceClass';
import S4ServiceObjectsStatusUpdateSequenceClass from '../ServiceOrders/Status/S4ServiceObjectsStatusUpdateSequenceClass';
import SubOperationStatusUpdateSequenceClass from '../SubOperations/MobileStatus/SubOperationStatusUpdateSequenceClass';
import WorkOrderStatusUpdateSequenceClass from '../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';

export default function MobileStatusUpdateActionsOrRulesSequence(context, updateToStatus, binding) {
    switch (binding['@odata.type']) {
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
            return WorkOrderStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue():
            return OperationStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue():
            return SubOperationStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue():
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue():
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue():
            return S4ServiceObjectsStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue():
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmationItem.global').getValue():
            return ConfirmationOrItemStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding);
        default:
            return [];
    }
}
