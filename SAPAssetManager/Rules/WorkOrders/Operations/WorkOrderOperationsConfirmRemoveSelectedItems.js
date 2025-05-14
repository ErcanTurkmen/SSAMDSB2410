import libCommon from '../../Common/Library/CommonLibrary';
import OperationsConfirmationsChangeMode from './OperationConfirmationsChangeMode';

export default function WorkOrderOperationsConfirmRemoveSelectedItems(clientAPI) {
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/Expense/ConfirmCloseExpensesPage.action',
        'Properties': {
            'Title': clientAPI.localizeText('remove_confirmation'),
            'OKCaption': clientAPI.localizeText('remove'),
            'Message': clientAPI.localizeText('confirm_remove_opertion_conf'),
            'OnOK': '',
        },
    }).then(({ data }) => {
        if (data === false) {
            return false;
        }
        return RemoveSelectedItemsFromState(clientAPI);
    });
}

function RemoveSelectedItemsFromState(clientAPI) {
    const itemsToRemove = libCommon.getStateVariable(clientAPI, 'selectedOperationConfirmations');
    const confirmationsData = libCommon.getStateVariable(clientAPI, 'OperationsToConfirm');
    const removedOperations = libCommon.getStateVariable(clientAPI, 'OperationsToRemove') || [];
    const isSelectAll = libCommon.getStateVariable(clientAPI, 'selectAllActive', 'WorkOrderOperationsListViewPage');
    const newConfirmationsData = confirmationsData.filter(item => 
        !(itemsToRemove.map(itm => itm['@odata.readLink']).includes(item.OperationReadlink)));
    if (newConfirmationsData.length) {
        if (isSelectAll) {
            removedOperations.push(...itemsToRemove.map(
                item => ({ binding: item })),
            );
            libCommon.setStateVariable(clientAPI, 'OperationsToRemove', removedOperations);
        }
        libCommon.setStateVariable(clientAPI, 'OperationsToConfirm', newConfirmationsData);
        libCommon.setStateVariable(clientAPI, 'selectedOperationConfirmations', []);
        return OperationsConfirmationsChangeMode(clientAPI);
    } else {
        libCommon.removeStateVariable(clientAPI, 'OperationsToConfirm');
        libCommon.removeStateVariable(clientAPI, 'OperationsToRemove');
        libCommon.removeStateVariable(clientAPI, 'selectedOperationConfirmations');
        return clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
}
