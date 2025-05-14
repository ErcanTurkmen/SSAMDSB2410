import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsCSServiceDataEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSServiceData.global').getValue());
}
