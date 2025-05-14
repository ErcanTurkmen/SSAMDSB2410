import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsEmergencyWorkEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/EmergencyWork.global').getValue());
}
