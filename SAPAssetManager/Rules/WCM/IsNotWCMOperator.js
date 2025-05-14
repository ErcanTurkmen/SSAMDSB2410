import libPersona from '../Persona/PersonaLibrary';
export default function IsNotWCMOperator(context) {
    return !libPersona.isWCMOperator(context);
}
