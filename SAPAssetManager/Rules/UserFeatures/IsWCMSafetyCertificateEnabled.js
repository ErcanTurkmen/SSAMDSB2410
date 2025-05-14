import userFeaturesLib from './UserFeaturesLibrary';

export default function IsWCMSafetyCertificateEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/WCMSafetyCertificate.global').getValue());
}
