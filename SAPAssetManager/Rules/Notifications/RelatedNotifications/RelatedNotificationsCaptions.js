import NotificationHistoriesCount from './RelatedNotificationsCount';

export default function RelatedNotificationsCaption(context) {
    return NotificationHistoriesCount(context).then(count => {
        if (count) {
            let params=[count];
            return context.localizeText('related_notifications_with_count',params);
        } else {
            return context.localizeText('no_related_notifications');
        }
    });
 }
