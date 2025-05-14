import libPersona from '../Persona/PersonaLibrary';
import IsWCMWorkPermitEnabled from '../UserFeatures/IsWCMWorkPermitEnabled';

export default function IsWorkPermitsMenuItemVisibleForST(context) {
    return libPersona.isWCMOperator(context) && IsWCMWorkPermitEnabled(context);
}
