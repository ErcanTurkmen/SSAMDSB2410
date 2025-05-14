import CommonLibrary from '../Common/Library/CommonLibrary';

export default function ServiceRequestOverallStatusConfigQueryOptions(context) {
    const RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/RequestMobileStatusObjectType.global').getValue();

    return `$filter=MobileStatus eq '${RECEIVED}' and ObjectType eq '${objectType}'`;
}
