import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsDefenseIntegrationEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DefenseIntegration.global').getValue());
}

