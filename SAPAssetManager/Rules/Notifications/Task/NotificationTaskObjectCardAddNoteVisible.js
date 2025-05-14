import libTaskMobStatus from './TaskMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libNotifMobStatus from '../MobileStatus/NotificationMobileStatusLibrary';

export default function NotificationTaskObjectCardAddNoteVisible(context) {
    const status = libTaskMobStatus.getMobileStatus(context);
    const completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const success = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());

    if ([completed, success].includes(status)) {
        return Promise.resolve(false);
    }
    return libNotifMobStatus.isNotificationComplete(context.getPageProxy()).then(result => !result);
}
