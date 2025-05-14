import IsWCMSafetyCertificateEnabled from '../../UserFeatures/IsWCMSafetyCertificateEnabled';
import IsWCMWorkPermitEnabled from '../../UserFeatures/IsWCMWorkPermitEnabled';

export default function WorkOrdersSectionUseTopPadding(context) {
    return IsWCMSafetyCertificateEnabled(context) || IsWCMWorkPermitEnabled(context);
}
