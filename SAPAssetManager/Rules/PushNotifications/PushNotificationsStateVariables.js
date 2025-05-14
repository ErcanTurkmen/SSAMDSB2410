import libCommon from '../Common/Library/CommonLibrary';
import getUnifiedKey from './PushNotificationPayloadKeys';

export default function PushNotificationsStateVariables(context, unifiedPayload) {
        libCommon.setStateVariable(context,'TitleLocArgs',unifiedPayload[getUnifiedKey(context, 'localizeTitleArguments')][0]);
}
