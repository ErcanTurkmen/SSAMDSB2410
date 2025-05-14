import libCommon from '../../../Common/Library/CommonLibrary';
import libMobile from '../../../MobileStatus/MobileStatusLibrary';

export default function NotificationItemCauseTaskActivityIconImages(context) {
    const icons = [];
    // check if this Notification Item Cause has been locally created

    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
        icons.push(libCommon.GetSyncIcon(context));
    }

    if (['COMPLETED', 'SUCCESS'].includes(libMobile.getMobileStatus(context.binding, context))) {
        icons.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
    }
    return icons;
}
