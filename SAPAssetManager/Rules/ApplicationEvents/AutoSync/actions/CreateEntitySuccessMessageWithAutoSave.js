import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function CreateEntitySuccessMessageWithAutoSave(context) {
  let actionName = '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action';
  if (CommonLibrary.getStateVariable(context, 'skipToastAndClosePageOnDocumentCreate')) {
    actionName = undefined;
  }
  return ExecuteActionWithAutoSync(context, actionName);
}
