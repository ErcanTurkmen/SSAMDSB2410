import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsNotWCMOperatorClassicLayout(context) {
    return !PersonaLibrary.isWCMOperator(context) || !PersonaLibrary.isClassicHomeScreenEnabled(context);
}
