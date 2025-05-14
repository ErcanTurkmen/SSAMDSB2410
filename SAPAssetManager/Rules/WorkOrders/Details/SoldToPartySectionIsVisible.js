import IsServiceOrder from './IsServiceOrder';
import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
 * Checks if SoldToPartySection should be visible
 * true in the case when an order is of type service order and active persona is not WCM
 * @param {ClientApi} context
 * @returns {boolean}
 */
export default function SoldToPartySectionIsVisible(context) {
    return !PersonaLibrary.isWCMOperator(context) && IsServiceOrder(context);
}
