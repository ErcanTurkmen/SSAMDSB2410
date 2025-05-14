import SafetyCertificateQABSettings from './SafetyCertificateQABSettings';
import IsLotoCertificate from './IsLotoCertificate';

export default async function SafetyCertificateQABChips(context) {
    const pageProxy = context.getPageProxy();
    const isLOTO = await IsLotoCertificate(pageProxy);

    const QABSettings = new SafetyCertificateQABSettings(context.getPageProxy(), isLOTO);

    return QABSettings.generateChips();
}
