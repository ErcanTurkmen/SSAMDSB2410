import libCommon from '../../Common/Library/CommonLibrary';

export default function OperationConfirmationsLocalConfirmationsInit(clientAPI) {
    libCommon.setStateVariable(clientAPI, 'selectedOperationConfirmations', []);
    libCommon.removeStateVariable(clientAPI, 'IsBulkConfirmationActive');
}
