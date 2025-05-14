import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';
import libPersona from '../../Persona/PersonaLibrary';
import WCMQABDetailsPageIsVisible from '../../WCM/QAB/WCMQABDetailsPageIsVisible';


export default async function WorkOrderQABIsVisible(context) {
    return IsFSMCSSectionVisible(context) || libPersona.isMaintenanceTechnician(context) || (libPersona.isWCMOperator(context) && await WCMQABDetailsPageIsVisible(context));
}
