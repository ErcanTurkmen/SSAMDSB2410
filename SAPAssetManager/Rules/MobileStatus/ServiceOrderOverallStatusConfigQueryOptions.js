import CommonLibrary from '../Common/Library/CommonLibrary';

export default function ServiceOrderOverallStatusConfigQueryOptions(context) {
    const RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();

    return `$filter=MobileStatus eq '${RECEIVED}' and ObjectType eq '${objectType}'`;
}
