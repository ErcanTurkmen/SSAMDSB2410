import SafetyCertificatesLibrary from '../WCM/SafetyCertificates/SafetyCertificatesLibrary';

export default function SideDrawerLOTOCertificatesCount(context) {
    return SafetyCertificatesLibrary.getLOTOCertificatesCount(context)
        .then(count => context.localizeText('isolation_certificates_x', [count]));
}
