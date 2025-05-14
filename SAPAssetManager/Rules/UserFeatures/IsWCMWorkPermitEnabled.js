import userFeaturesLib from './UserFeaturesLibrary';

export default function IsWCMWorkPermitEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/WCMWorkPermit.global').getValue());
}
