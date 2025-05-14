import OperationsConfirmationsChangeMode from './OperationConfirmationsChangeMode';
import OperationConfirmationsOnCancel from './OperationConfirmationsOnCancel';

export default function OperationConfirmationsCancelButton(clientAPI) {
    if (clientAPI.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
        return OperationsConfirmationsChangeMode(clientAPI);
    } else {
        return OperationConfirmationsOnCancel(clientAPI);
    }
}
