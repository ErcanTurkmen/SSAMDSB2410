import { GetCertificateCountCaption } from './OtherCertificatesListViewCountCaption';
import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function CertificatesListViewCountCaption(context) {
    const navigationRelatedFilterTerm = SafetyCertificatesLibrary.getRelatedWorkPermitFilterTerm(context.getPageProxy());
    // if there is a nav related term, we are on the related certificates list page -> dont filter by the cert type
    return GetCertificateCountCaption(context, navigationRelatedFilterTerm || SafetyCertificatesLibrary.GetLOTOCertificateFilterTerm());
}
