import CommonLibrary from '../Common/Library/CommonLibrary';

export default function GetReleasedStatusCode(context) {
    let groupName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceOrderGroup.global').getValue();
    let releasedParamName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceOrderReleasedStatus.global').getValue();
    
    return CommonLibrary.getAppParam(context, groupName, releasedParamName) || '';
}
