import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsServiceOrder from './IsServiceOrder';

export default function IsBusinessPartnersFacetVisible(context) {
    if (PersonaLibrary.isWCMOperator(context)) {
        return false;
    }

    return IsServiceOrder(context);
}
