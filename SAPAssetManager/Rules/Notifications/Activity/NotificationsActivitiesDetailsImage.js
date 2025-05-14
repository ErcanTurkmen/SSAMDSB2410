import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function NotificationsActivitiesDetailsImage(context) {
    return PersonaLibrary.isClassicHomeScreenEnabled(context) ? undefined : '$(PLT, /SAPAssetManager/Images/DetailImages/Activity.png, /SAPAssetManager/Images/DetailImages/Activity.android.png)';
}
