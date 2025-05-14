import common from '../../Common/Library/CommonLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function NotificationsListViewFormat(context) {
    const section = context.getName();
    const property = context.getProperty();
    let binding = context.binding.NotificationHeader_Nav ? context.binding.NotificationHeader_Nav : context.binding;
    let value = '';
    let mobileStatus;
    let odataDate, priority;

    switch (section) {
        case 'NotificationsList':
        case 'FollowOnNotificationsList':
        case 'MyNotificationSection':
            switch (property) {
                case 'Footnote':
                    if (binding.RequiredEndDate) {
                        odataDate = OffsetODataDate(context, binding.RequiredEndDate);
                        value = context.formatDate(odataDate.date());
                        break;
                    } else {
                        value = context.localizeText('no_due_date');
                        break;
                    }
                case 'StatusText':
                    priority = binding.NotifPriority;
                    value = common.isDefined(priority) ? priority.PriorityDescription : context.localizeText('none');
                    break;
                case 'SubstatusText':
                    mobileStatus = libMobile.getMobileStatus(binding, context);
                    if (mobileStatus) {
                        value = context.localizeText(mobileStatus);
                    } else if (binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav) {
                        value = binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusLabel;
                    }
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return value;
}
