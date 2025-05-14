import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsCSServiceOrderEnabled(clientAPI) {
    return UserFeaturesLibrary.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSServiceOrder.global').getValue());
}
