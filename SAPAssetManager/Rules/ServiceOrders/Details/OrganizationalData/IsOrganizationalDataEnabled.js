import UserFeaturesLibrary from '../../../UserFeatures/UserFeaturesLibrary';

export default function IsOrganizationalDataEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceData.global').getValue());
}
