import CommonLibrary from '../Common/Library/CommonLibrary';

export default function IsMetadataParsingFeatureEnabled(context) {
    let lcncParamGroup = context.getGlobalDefinition('/SAPAssetManager/Globals/LCNC/LCNCParamGroup.global').getValue();
    let metadataParsingFeatureParam = context.getGlobalDefinition('/SAPAssetManager/Globals/LCNC/MetadataParsingFeatureParameter.global').getValue();

    let metadataFeature = CommonLibrary.getAppParam(context, lcncParamGroup, metadataParsingFeatureParam);

    return metadataFeature === 'Y';
}
