import libPersona from '../../Persona/PersonaLibrary';


export default function NotificationDetailsPageToOpen(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '/SAPAssetManager/Pages/Notifications/NotificationDetails.page' : '/SAPAssetManager/Pages/Notifications/NotificationDetailsClassic.page';
}

export function NotificationDetailsPageName(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? 'NotificationDetailsPage' : 'NotificationDetailsClassicPage';
}
