import CommonLibrary from '../../Common/Library/CommonLibrary';
import RelatedSafetyCertificatesReadLink from './RelatedSafetyCertificatesReadLink';

export default function RelatedSafetyCertificatesCount(context) {
    return CommonLibrary.getEntitySetCount(context, RelatedSafetyCertificatesReadLink(context.binding), '');
}
