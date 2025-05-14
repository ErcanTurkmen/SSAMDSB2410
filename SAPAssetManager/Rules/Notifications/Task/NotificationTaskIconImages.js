import libCommon from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function NotificationTaskIconImages(context) {
    let iconImage = [];

    // check if this Notification Task has been locally created
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
        iconImage.push(libCommon.GetSyncIcon(context));
    }
    // Check mobile status
    if (['COMPLETED', 'SUCCESS'].includes(libMobile.getMobileStatus(context.binding, context))) {
        iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
    }
    return iconImage;
}
