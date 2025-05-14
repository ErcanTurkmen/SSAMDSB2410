import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsPhaseControlEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PhaseModel.global').getValue())
        && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PhaseControl.global').getValue());
}
