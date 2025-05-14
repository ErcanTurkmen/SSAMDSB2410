import libMobile from './MobileStatusLibrary';

export default function OperationMobileStatus(context) {
    let binding = context.binding;
    if (binding && binding.OperationNo && libMobile.isOperationStatusChangeable(context)) {
        let mobileStatus = libMobile.getMobileStatus(context.binding, context);
        if (mobileStatus === 'D-COMPLETE') {
            return '';
        }
        return mobileStatus ? context.localizeText(mobileStatus) : '';
    } else {
        return '';
    }
}
