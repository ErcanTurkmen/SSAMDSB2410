import libFeature from '../UserFeatures/UserFeaturesLibrary';

export default function EnableTechObjectsFacet(context) {
    return libFeature.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CATechObj.global').getValue());
}
