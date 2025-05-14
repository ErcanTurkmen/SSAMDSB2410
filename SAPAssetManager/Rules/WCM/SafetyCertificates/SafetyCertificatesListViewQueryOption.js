import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';


export default function SafetyCertificatesListViewQueryOption(context) {
    return SafetyCertificatesLibrary.getCertificatesListQueryOptions(context);
}
