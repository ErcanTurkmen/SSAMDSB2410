import assignedTo from './WorkOrderAssignedTo';

export default function WorkOrderAssignedToListWrapper(context) {
    return assignedTo(context, true).then((result) => {
        if (result === context.localizeText('unassigned')) {
            return context.localizeText('unassigned');
        }
        return context.localizeText('assignedto') + ' ' + result;
    });
}
