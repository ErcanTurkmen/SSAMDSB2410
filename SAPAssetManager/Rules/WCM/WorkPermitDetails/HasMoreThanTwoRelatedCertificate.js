import GetRelatedCertificatesCount from './GetRelatedCertificatesCount';

export default function HasMoreThanTwoRelatedCertificate(context) {
    return GetRelatedCertificatesCount(context).then(count => count > 2);
}
