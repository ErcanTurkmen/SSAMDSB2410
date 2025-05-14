import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function EnableAttachment(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Attachment.global').getValue());
}
