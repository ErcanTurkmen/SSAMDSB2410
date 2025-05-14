import PersonaLibrary from '../Persona/PersonaLibrary';

export default function BusinessPartnerDetailsImage(context) {
    return PersonaLibrary.isClassicHomeScreenEnabled(context) ? undefined : '$(PLT, /SAPAssetManager/Images/DetailImages/Partner.png, /SAPAssetManager/Images/DetailImages/Partner.android.png)';
}
