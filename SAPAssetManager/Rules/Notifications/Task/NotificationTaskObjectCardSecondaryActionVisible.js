import TaskEnableMobileStatus from '../MobileStatus/TaskEnableMobileStatus';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default async function NotificationTaskObjectCardSecondaryActionVisible(context) {
    if (await TaskEnableMobileStatus(context)) {
        return libMobile.getMobileStatus(context.binding, context) ===
            libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    }

    return false;
}
