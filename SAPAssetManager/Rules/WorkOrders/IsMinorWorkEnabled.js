import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsMinorWorkEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/MinorWork.global').getValue());
}
