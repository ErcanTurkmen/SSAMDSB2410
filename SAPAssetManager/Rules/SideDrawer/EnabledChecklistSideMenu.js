import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function EnabledChecklistSideMenu(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue());
}
