/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsPMNotificationEnabled(clientAPI) {
    return UserFeaturesLibrary.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMNotifications.global').getValue());
}
