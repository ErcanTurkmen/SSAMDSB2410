import HideActionItems from '../../../Common/HideActionItems';
import TaskStatusLib from '../TaskMobileStatusLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function NotificationTaskDetailsDidHideActionItems(context) {
    const status = TaskStatusLib.getMobileStatus(context);
    const completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const success = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
    if (status === completed || status === success) {
        HideActionItems(context, 2);
        return true;
    }
    return false;
}
