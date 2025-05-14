import PersonaLibrary from '../../Persona/PersonaLibrary';
import EnableNotificationCreate from '../../UserAuthorizations/Notifications/EnableNotificationCreate';

export default function IsAddNotificationToEquipFlocVisible(context) {
    return PersonaLibrary.isWCMOperator(context) && EnableNotificationCreate(context);
}
