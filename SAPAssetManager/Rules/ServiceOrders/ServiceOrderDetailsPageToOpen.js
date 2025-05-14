import PersonaLibrary from '../Persona/PersonaLibrary';
import EDTSoftInputModeConfig from '../Extensions/EDT/EDTSoftInputModeConfig';

export default async function ServiceOrderDetailsPageToOpen(clientAPI) {
    EDTSoftInputModeConfig(clientAPI);
    return PersonaLibrary.isNewHomeScreenEnabled(clientAPI) ? '/SAPAssetManager/Pages/ServiceOrders/ServiceOrderDetails.page' : '/SAPAssetManager/Pages/ServiceOrders/ServiceOrderDetailsClassic.page';
}

export function ServiceOrderDetailsPageName(context) {
    return PersonaLibrary.isNewHomeScreenEnabled(context) ? 'ServiceOrderDetailsPage' : 'ServiceOrderDetailsClassic';
}
