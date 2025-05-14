import libPersona from '../../Persona/PersonaLibrary';
import EDTSoftInputModeConfig from '../../Extensions/EDT/EDTSoftInputModeConfig';

export default function WorkOrderDetailsPageToOpen(context) {
    if (IsWorkOrderDetailsWithObjectCardsPageEnabled(context)) {
        EDTSoftInputModeConfig(context);
        return '/SAPAssetManager/Pages/WorkOrders/WorkOrderDetailsWithObjectCards.page';
    }
    return '/SAPAssetManager/Pages/WorkOrders/WorkOrderDetails.page';
}

export function WorkOrderDetailsPageName(context) {
    return IsWorkOrderDetailsWithObjectCardsPageEnabled(context) ? 'WorkOrderDetailsWithObjectCardsPage' : 'WorkOrderDetailsPage';
}

export function IsWorkOrderDetailsWithObjectCardsPageEnabled(context) {
    return libPersona.isNewHomeScreenEnabled(context) && (libPersona.isMaintenanceTechnician(context) || libPersona.isFieldServiceTechnicianInCSMode(context) || libPersona.isWCMOperator(context));
}
