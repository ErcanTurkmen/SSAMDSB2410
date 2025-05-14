import libPersona from '../Persona/PersonaLibrary';

export default function SubOperationDetailsPageToOpen(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationDetails.page' : '/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationDetailsClassic.page';
}

export function SubOperationDetailsPageName(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? 'SubOperationDetailsPage' : 'SubOperationDetailsClassicPage';
}
