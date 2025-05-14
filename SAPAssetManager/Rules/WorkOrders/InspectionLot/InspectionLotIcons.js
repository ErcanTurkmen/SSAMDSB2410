import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';

export default function InspectionLotIcons(context) {
    const iconImage = [];
    let isLocal = false;

    const docsIcon = AttachedDocumentIcon(context, context.binding.InspectionLot_Nav.InspectionLotDocument_Nav);
    if (docsIcon) {
        iconImage.push(docsIcon);
    }

    // check if this checlist requires sync
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:InspectionLot_Nav/#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
        isLocal = true;
    }

    if (!isLocal) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionChar_Nav`, '$filter=sap.islocal()').then(count => {
            if (count > 0) {
                iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
            }
            return iconImage;
        });
    }
    return iconImage;
}
