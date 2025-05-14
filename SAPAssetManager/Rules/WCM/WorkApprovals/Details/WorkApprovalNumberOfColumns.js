import libPersona from '../../../Persona/PersonaLibrary';

export default function WorkApprovalNumberOfColumns(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? 2 : 1;
}
