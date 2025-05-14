import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsCSNotificationEnabled(clientAPI) {
    return UserFeaturesLibrary.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSNotifications.global').getValue());
}
