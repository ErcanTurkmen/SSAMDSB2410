import libPersona from '../Persona/PersonaLibrary';
import IsWCMSafetyCertificateEnabled from '../UserFeatures/IsWCMSafetyCertificateEnabled';

export default function IsCertificatesMenuItemVisibleForST(context) {
    return libPersona.isWCMOperator(context) && IsWCMSafetyCertificateEnabled(context);   
}
