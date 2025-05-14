import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function LOTOCertificatesOverviewPageQueryOption() {
    return `$filter=${SafetyCertificatesLibrary.createQueryStringFromCriterias(SafetyCertificatesLibrary.getLOTOCertificatesFiltersCriteria())}&$top=4`;
}
