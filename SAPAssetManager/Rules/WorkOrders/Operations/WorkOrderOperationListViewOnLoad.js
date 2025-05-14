import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import setCaption from './WorkOrderOperationListViewSetCaption';
import libCommon from '../../Common/Library/CommonLibrary';
import { ResetBulkConfirmationQueue } from './BulkConfirmationQueue';
import FilterSettings from '../../Filter/FilterSettings';

export default function WorkOrderOperationListViewOnLoad(clientAPI) {
    ResetBulkConfirmationQueue(clientAPI);
    FilterSettings.saveInitialFilterForPage(clientAPI);
    FilterSettings.applySavedFilterOnList(clientAPI);
    setCaption(clientAPI).then(() => {
        let myOperationListView = libCommon.getStateVariable(clientAPI, 'MyOperationListView');
        if (myOperationListView === true) {
            libCommon.removeStateVariable(clientAPI, 'MyOperationListView');
        }
    });

    const parameters = libCommon.getStateVariable(clientAPI,'OPERATIONS_FILTER');
    if (!parameters) {
        libCommon.setStateVariable(clientAPI, 'OPERATIONS_FILTER', '');
    }
    libCommon.setStateVariable(clientAPI, 'OperationsToSelectCount', undefined);
    libCommon.setStateVariable(clientAPI, 'selectedOperations', []);
    libCommon.setStateVariable(clientAPI, 'firstOpenMultiSelectMode', true);
    return libWOStatus.isOrderComplete(clientAPI).then(status => {
        if (status) {
            clientAPI.setActionBarItemVisible('Add', false);
        }
    });
}
