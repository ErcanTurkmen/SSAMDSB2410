import libCom from '../../Common/Library/CommonLibrary';
import RelatedWorkPermitsReadLink from './RelatedWorkPermitsReadLink';
import { GetRelatedByDataTypeFilterTerm } from './WorkPermitsListViewQueryOption';

export default function WorkPermitsCount(context) {
    const pageProxy = context.getPageProxy();
    const filterRelated = GetRelatedByDataTypeFilterTerm(pageProxy);
    return libCom.getEntitySetCount(context, RelatedWorkPermitsReadLink(pageProxy), filterRelated ? `$filter=${filterRelated}` : '');
}
