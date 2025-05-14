import RelatedSafetyCertificatesReadLink from './RelatedSafetyCertificatesReadLink';


export default function RelatedSafetyCertificates(sectionProxy) {
    let context = sectionProxy.getPageProxy();
    return RelatedSafetyCertificatesReadLink(context.binding);
}
