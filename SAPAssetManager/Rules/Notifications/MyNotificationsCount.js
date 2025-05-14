import notificationCount from './NotificationsCountOnOverviewPage';
import common from '../Common/Library/CommonLibrary';

//Notification count for the My Notificatino section on the new homepage
export default function MyNotificationsCount(context) {
    let userName = common.getSapUserName(context);
    const started = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
    let queryOptions = `$filter=ReportedBy eq '${userName}' or NotifMobileStatus_Nav/MobileStatus eq '${started}'`;

    return notificationCount(context, queryOptions).then(count => {
        return count;
    });
}
