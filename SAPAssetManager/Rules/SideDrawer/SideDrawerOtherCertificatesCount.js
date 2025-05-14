import SafetyCertificatesLibrary from '../WCM/SafetyCertificates/SafetyCertificatesLibrary';

export default function SideDrawerOtherCertificatesCount(context) {
    return SafetyCertificatesLibrary.getCertificatesLabelWithCount(context, SafetyCertificatesLibrary.OtherCertificatesTranslationKeysWithCount, SafetyCertificatesLibrary.GetOtherCertificateFilterTerm());
}
