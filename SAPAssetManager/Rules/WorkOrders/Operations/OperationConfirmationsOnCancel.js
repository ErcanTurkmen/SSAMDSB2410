import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OperationConfirmationsOnCancel(clientAPI) {
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/Expense/ConfirmCloseExpensesPage.action',
        'Properties': {
            'Title': clientAPI.localizeText('are_you_sure'),
            'OKCaption': clientAPI.localizeText('ok'),
            'Message': clientAPI.localizeText('confirm_cancel'),
            'OnOK': '',
        },
    }).then(({ data }) => {
        if (data === false) {
            return false;
        }
        return resetBeforeCancel(clientAPI);
    });
}

function resetBeforeCancel(clientAPI) {
    CommonLibrary.removeStateVariable(clientAPI, 'OperationsToConfirm');
    CommonLibrary.removeStateVariable(clientAPI, 'OperationsToRemove');
    return clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
