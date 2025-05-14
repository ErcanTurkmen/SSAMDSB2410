import libPersona from '../../Persona/PersonaLibrary';
import IsLotoCertificate from './Details/IsLotoCertificate';

export default async function CertificateDetailImage(context) {
    if (!libPersona.isClassicHomeScreenEnabled(context)) {
        return await IsLotoCertificate(context) ? '$(PLT, /SAPAssetManager/Images/DetailImages/IsolationCertificate.png, /SAPAssetManager/Images/DetailImages/IsolationCertificate.android.png)' : '$(PLT, /SAPAssetManager/Images/DetailImages/OtherCertificate.png, /SAPAssetManager/Images/DetailImages/OtherCertificate.android.png)';
    }

    return undefined;
}
