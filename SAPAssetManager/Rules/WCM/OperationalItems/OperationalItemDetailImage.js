import libPersona from '../../Persona/PersonaLibrary';

export default function OperationalItemDetailImage(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? undefined : '$(PLT, /SAPAssetManager/Images/DetailImages/OperationalItem.png, /SAPAssetManager/Images/DetailImages/OperationalItem.android.png)';
}
