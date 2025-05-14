import notif from './NotificationLibrary';
import common from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import libAnalytics from '../AnalyticsManager/AnalyticsManagerLibrary';

export default function ResetNotificationFlags(context) {
    if (notif.getAddFromOperationFlag(context)) {
        notif.setAddFromOperationFlag(context, false);
    }

    if (notif.getAddFromSuboperationFlag(context)) {
        notif.setAddFromSuboperationFlag(context, false);
    }

    common.setOnCreateUpdateFlag(context, '');

    ApplicationSettings.remove(context, 'Geometry');
    
    const isPreviousPageModal = context.evaluateTargetPathForAPI('#Page:-Previous')._page.isModal();
    if (isPreviousPageModal) {
        return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').finally(() => {
        //Add libAnalytics Check here
        libAnalytics.notificationCreateCancel();
    });
}
