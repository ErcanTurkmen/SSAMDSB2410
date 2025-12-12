import libCom from '../../Common/Library/CommonLibrary';
import OperationsToSelectCount from './OperationsToSelectCount';
import Logger from '../../Log/Logger';


export default async function WorkOrderOperationsSelectDeselectButtonVisible(context, isSelectAllButton = true) {

    let operationsToSelect = await OperationsToSelectCount(context);
    Logger.error("Poonam operationsToSelect", operationsToSelect);
    if (context.getPageProxy().getControl('SectionedTable')) {
        Logger.error("Poonam operationsToSelect 1");
        if (context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
            Logger.error("Poonam operationsToSelect 2");
            if (!operationsToSelect) {
                Logger.error("Poonam !operationsToSelect");
                return false;
            }

            const selectedOperations = libCom.getStateVariable(context, 'selectedOperations');
            Logger.error("Poonam selectedOperations", selectedOperations);
            if (isSelectAllButton) {
                Logger.error("Poonam selectedOperations.length", selectedOperations.length);
                return selectedOperations ? selectedOperations.length !== operationsToSelect : true;
            } else {
                 Logger.error("Poonam selectedOperations.length 2", selectedOperations.length);
                return (selectedOperations && selectedOperations.length) > 0;
            }
        }
    }
    Logger.error("Poonam false");
    return false;
}
