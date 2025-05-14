import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function OtherCertificatesListViewQueryOption(context) {
    return SafetyCertificatesLibrary.getCertificatesListQueryOptions(context, SafetyCertificatesLibrary.GetOtherCertificateFilterTerm());
}
