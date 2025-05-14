import SafetyCertificateMobileStatusTextOrEmpty from './SafetyCertificateMobileStatusTextOrEmpty';
import SafetyCertificateUsageDescriptionOrEmpty from './SafetyCertificateUsageDescriptionOrEmpty';

export default function SafetyCertificateTags(context) {
    return Promise.all([
        SafetyCertificateMobileStatusTextOrEmpty(context),
        SafetyCertificateUsageDescriptionOrEmpty(context),
    ]).then(possibleEmptyTags => possibleEmptyTags.filter(stringOrEmpty => !!stringOrEmpty));
}
