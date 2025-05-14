import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';

export default function WorkOrderListViewIconImages(context) {
    let binding = context.getBindingObject();
    let iconImage = [];

    // check if this WO has any docs
    const docsIcon = AttachedDocumentIcon(context, binding.WODocuments);
    if (docsIcon) {
        iconImage.push(docsIcon);
    }

    // check if this is a Marked Job
    if (binding.MarkedJob && binding.MarkedJob.PreferenceValue && binding.MarkedJob.PreferenceValue === 'true') {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/favoriteListIcon.android.png' : '/SAPAssetManager/Images/favoriteListIcon.png');
    }

    let hasLocalOperation = binding.Operations ? binding.Operations.find(operation => operation['@sap.isLocal']) : false;
    // check if this order requires sync
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal') || hasLocalOperation || libCommon.getTargetPathValue(context, '#Property:OrderMobileStatus_Nav/#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:HeaderLongText/#Property:0/#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}
