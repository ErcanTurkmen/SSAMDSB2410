import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsServiceReportFeatureEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ServiceReport.global').getValue());
}
