import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function AutoCompleteOnApprovalWarningTitle(context) {
    if (libMobile.isHeaderStatusChangeable(context)) {
        return '$(L,order_auto_complete_warning_title)';
    } else if (libMobile.isOperationStatusChangeable(context)) {
        return '$(L,operation_auto_complete_warning_title)';
    }
}
