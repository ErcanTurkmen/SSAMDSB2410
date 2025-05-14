import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationDetailsReportedBy(context) {
    const binding = context.binding;
    if (libVal.evalIsEmpty(binding.ReportedBy)) {
        return '-';
    }

    return binding.ReportedBy;
}
