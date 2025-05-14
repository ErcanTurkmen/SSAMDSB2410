import ComLib from '../../../../Common/Library/CommonLibrary';

export default function NotificationItemCauseCreateUpdateOnCommit(clientAPI) {
    if (ComLib.IsOnCreate(clientAPI)) {
        ComLib.resetChangeSetActionCounter(clientAPI);
        ComLib.setOnChangesetFlag(clientAPI, true);
        ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'NotificationItemCause');
        return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreateChangeSet.action');
    }
    return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseUpdate.action');
}
