import libCom from '../../Common/Library/CommonLibrary';
import OperationsToSelectCount from './OperationsToSelectCount';

export default async function WorkOrderOperationsSelectDeselectButtonVisible(context, isSelectAllButton = true) {

    let operationsToSelect = await OperationsToSelectCount(context);

    if (context.getPageProxy().getControl('SectionedTable')) {
        if (context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
            if (!operationsToSelect) {
                return false;
            }

            const selectedOperations = libCom.getStateVariable(context, 'selectedOperations');
            if (isSelectAllButton) {
                return selectedOperations ? selectedOperations.length !== operationsToSelect : true;
            } else {
                return (selectedOperations && selectedOperations.length) > 0;
            }
        }
    }
    return false;
}
