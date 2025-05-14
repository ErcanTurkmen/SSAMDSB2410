import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';
import { GetAttachmentIcon } from '../Overview/MaterialDocumentIcon';

export default async function ProductionOrderListViewIconImages(context) {
    let iconImage = [];
    
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    const attachmentIcon = await GetAttachmentIcon(context, context.binding);
    if (attachmentIcon && (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal'))) {
        iconImage.push(attachmentIcon);
    }

    return iconImage;
}
