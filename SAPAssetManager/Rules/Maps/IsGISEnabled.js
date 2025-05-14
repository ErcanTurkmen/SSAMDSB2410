import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsGISEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
}
