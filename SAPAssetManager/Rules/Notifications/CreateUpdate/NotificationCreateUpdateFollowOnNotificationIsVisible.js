import common from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdateFollowOnNotificationIsVisible(context) {
    let onCreate = common.IsOnCreate(context);
    if (onCreate) {
        return context.binding.OrderId ? true : false;
    }
    return false;
}
