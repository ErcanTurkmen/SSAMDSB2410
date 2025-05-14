import libPersona from '../Persona/PersonaLibrary';
import WCMWorkApprovalsVisible from '../WCM/Common/WCMWorkApprovalsVisible';

export default function IsWorkApprovalsMenuItemVisibleForST(context) {
    return libPersona.isWCMOperator(context) && WCMWorkApprovalsVisible(context);
}
