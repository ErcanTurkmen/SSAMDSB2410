import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdateFollowOnNotification(context) {
    return libCommon.setStateVariable(context, 'isFollowOn', context.getValue());
}
