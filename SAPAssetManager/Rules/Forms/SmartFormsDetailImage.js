import libPersona from '../Persona/PersonaLibrary';

export default function SmartFormsDetailImage(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '$(PLT, /SAPAssetManager/Images/DetailImages/Checklist_Smartform.png, /SAPAssetManager/Images/DetailImages/Checklist_Smartform.android.png)' : undefined;
}
