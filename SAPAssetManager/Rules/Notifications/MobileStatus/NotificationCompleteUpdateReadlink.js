import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function NotificationCompleteUpdateReadlink(context) {
	const binding = context.binding;
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    let statusProfile = binding.NotifMobileStatus_Nav?.EAMOverallStatusProfile || '';

    return `EAMOverallStatusConfigs(Status='NOTIFICATION: ${COMPLETED}',EAMOverallStatusProfile='${statusProfile}')`;

}
