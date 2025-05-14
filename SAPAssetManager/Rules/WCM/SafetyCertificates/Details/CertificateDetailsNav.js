import { AcyclicNavigate } from '../../Common/AcyclicNavigate';

export default function CertificateDetailsNav(context) {
    return AcyclicNavigate(context, 'SafetyCertificateDetailsPage', '/SAPAssetManager/Actions/WCM/SafetyCertificateDetailsNav.action', (prevBinding, currBinding) => prevBinding.WCMDocument === currBinding.WCMDocument, 2);
}
