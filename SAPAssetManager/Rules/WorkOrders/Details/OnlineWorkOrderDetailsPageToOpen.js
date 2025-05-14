import libPersona from '../../Persona/PersonaLibrary';

export default function OnlineWorkOrderDetailsPageToOpen(context) {
    return IsWorkOrderDetailsWithObjectCardsPageEnabled(context) ? '/SAPAssetManager/Pages/WorkOrders/OnlineWorkOrderDetails.page' : '/SAPAssetManager/Pages/WorkOrders/OnlineClassicWorkOrderDetailsPage.page';
}

export function OnlineWorkOrderDetailsPageName(context) {
    return IsWorkOrderDetailsWithObjectCardsPageEnabled(context) ? 'OnlineWorkOrderDetails' : 'OnlineClassicWorkOrderDetailsPage';
}

export function IsWorkOrderDetailsWithObjectCardsPageEnabled(context) {
    return libPersona.isNewHomeScreenEnabled(context) && (libPersona.isMaintenanceTechnician(context) || libPersona.isFieldServiceTechnicianInCSMode(context) || libPersona.isWCMOperator(context));
}
