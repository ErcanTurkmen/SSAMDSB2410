import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';

export default function ZOperationsNotificationStatus(context) {
    // To display the notification status on list on operation details screen
    var binding = context.binding;
    var value = '';
    return context.localizeText(libMobile.getMobileStatus(context.binding, context));
}
