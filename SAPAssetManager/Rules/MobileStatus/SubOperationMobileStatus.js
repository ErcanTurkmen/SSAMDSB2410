import libMobile from './MobileStatusLibrary';

export default function SubOperationMobileStatus(context) {
    let binding = context.binding;
    if (binding && binding.SubOperationNo && libMobile.isSubOperationStatusChangeable(context)) {
        const mobileStatus = libMobile.getMobileStatus(binding, context);
        return mobileStatus ? context.localizeText(mobileStatus) : '';
    } else {
        return '';
    }
}
