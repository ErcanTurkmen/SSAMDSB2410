import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function isDefenseEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Defense.global').getValue());
}
