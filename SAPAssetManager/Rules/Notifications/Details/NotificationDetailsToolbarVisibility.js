import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../Common/Library/CommonLibrary';
import NotificationEnableMobileStatus from '../MobileStatus/NotificationEnableMobileStatus';

export default function NotificationDetailsToolbarVisibility(context) {
    return NotificationEnableMobileStatus(context).then(visible => {
        return visible && common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
    });
}
