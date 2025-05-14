import libPersona from '../../Persona/PersonaLibrary';

export default function WorkPermitDetailImage(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? undefined : '$(PLT, /SAPAssetManager/Images/DetailImages/WorkPermit.png, /SAPAssetManager/Images/DetailImages/WorkPermit.android.png)';
}
