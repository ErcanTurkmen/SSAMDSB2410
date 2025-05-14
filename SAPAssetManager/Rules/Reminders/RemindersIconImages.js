import libCommon from '../Common/Library/CommonLibrary';
import isAndroid from '../Common/IsAndroid';

export default function RemindersIconImages(context) {
    let iconImage = [];

    // check if this reminder requires sync
    if (libCommon.getTargetPathValue(context, '#Property:@sap.hasPendingChanges')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}
