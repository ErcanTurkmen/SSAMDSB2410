import libPersona from '../../Persona/PersonaLibrary';
import EDTSoftInputModeConfig from '../../Extensions/EDT/EDTSoftInputModeConfig';

export default function ServiceItemDetailsPageToOpen(context) {
    EDTSoftInputModeConfig(context);
    return libPersona.isNewHomeScreenEnabled(context) ? '/SAPAssetManager/Pages/ServiceOrders/ServiceItems/ServiceItemDetails.page' : '/SAPAssetManager/Pages/ServiceOrders/ServiceItems/ServiceItemDetailsClassic.page';
}

export function ServiceItemDetailsPageName(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? 'ServiceItemDetailsPage' : 'ServiceItemDetailsClassicPage';
}
