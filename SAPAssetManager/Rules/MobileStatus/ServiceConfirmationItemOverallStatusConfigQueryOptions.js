import CommonLibrary from '../Common/Library/CommonLibrary';

export default function ServiceConfirmationItemOverallStatusConfigQueryOptions(context) {
    const OPEN = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OpenParameterName.global').getValue()) || 'OPEN';
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ConfirmationItemMobileStatusObjectType.global').getValue();

    return `$filter=MobileStatus eq '${OPEN}' and ObjectType eq '${objectType}'`;
}
