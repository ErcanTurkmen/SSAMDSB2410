import libCommon from '../Common/Library/CommonLibrary';

export default function NotificationEntitySet(context) {
    if (context) {
        let binding = context.getPageProxy().binding;
        let isOnFollowOnList = libCommon.getStateVariable(context, 'OnFollowOnNotificationsList');
        
        if (binding && binding['@odata.readLink'] && !isOnFollowOnList) {
            return binding['@odata.readLink'] + '/NotificationHeader';
        } else {
            return 'MyNotificationHeaders';
        }
    }
    return 'MyNotificationHeaders';
}
