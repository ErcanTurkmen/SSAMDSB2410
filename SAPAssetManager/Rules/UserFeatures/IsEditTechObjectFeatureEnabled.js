import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsEditTechObjectFeatureEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/TechObjectEdit.global').getValue());
}
