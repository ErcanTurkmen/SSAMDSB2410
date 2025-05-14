import WorkOrderStartedOrOperationLevelAssignment from './WorkOrderStartedOrOperationLevelAssignment';

export default function WorkOrderOperationsLongPress(context) {
    return WorkOrderStartedOrOperationLevelAssignment(context) ? 'Multiple' : 'None';
}
