import CommonLibrary from '../Common/Library/CommonLibrary';

export default function ServiceConfirmationOverallStatusConfigQueryOptions(context) {
    const OPEN = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OpenParameterName.global').getValue()) || 'OPEN';
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ConfirmationMobileStatusObjectType.global').getValue();

    return `$filter=MobileStatus eq '${OPEN}' and ObjectType eq '${objectType}'`;
}
