import libPersona from '../Persona/PersonaLibrary';
import IsWCMWorkPermitEnabled from '../UserFeatures/IsWCMWorkPermitEnabled';
import IsWCMSafetyCertificateEnabled from '../UserFeatures/IsWCMSafetyCertificateEnabled';
import WCMWorkApprovalsVisible from '../WCM/Common/WCMWorkApprovalsVisible';

export default function IsWCMSectionVisible(context) {
    return !libPersona.isWCMOperator(context) && (WCMWorkApprovalsVisible(context) || IsWCMWorkPermitEnabled(context) || IsWCMSafetyCertificateEnabled(context));
}
