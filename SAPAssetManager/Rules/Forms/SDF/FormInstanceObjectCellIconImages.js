import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';

/**
 * 
 * @param {IClientAPI} context 
 * @returns {string[]}
 */
export default function FormInstanceObjectCellIconImages(context) {
    let iconImage = [];

    // check if this order requires sync
    if (libCommon.getTargetPathValue(context, '#Property:DynamicFormInstance_Nav/#Property:@sap.hasPendingChanges')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}
