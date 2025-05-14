import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function UpdateEntitySuccessMessageWithAutoSave(context) {
    let actionName = '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action';
    if (CommonLibrary.getStateVariable(context, 'skipToastAndClosePageOnDocumentCreate')) {
        actionName = undefined;
        CommonLibrary.setStateVariable(context, 'skipToastAndClosePageOnDocumentCreate', false);
    }
    return ExecuteActionWithAutoSync(context, actionName);
}
