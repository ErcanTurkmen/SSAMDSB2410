import CommonLibrary from '../../Common/Library/CommonLibrary';
import { GetSearchStringFilterTerm } from '../Common/ListPageQueryOptionsHelper';
import RelatedSafetyCertificates from './RelatedSafetyCertificates';
import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function OtherCertificatesListViewCountCaption(context) {
    return GetCertificateCountCaption(context, SafetyCertificatesLibrary.GetOtherCertificateFilterTerm());
}

export function GetCertificateCountCaption(context, certificatePreFilter) {
    const pageProxy = context.getPageProxy();
    const toExpand = 'WCMApplicationDocuments,WCMDocumentPartners,WCMDocumentPartners/Employee_Nav,WCMDocumentUsages';

    const sectionedTable = pageProxy.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(sectionedTable);
    const extraFilters = GetSearchStringFilterTerm(sectionedTable, sectionedTable?.searchString.toLowerCase(), ['WCMDocument', 'ShortText'], 'WCMDocumentHeader');

    const filterTerm = joinTerms(certificatePreFilter, sectionedTableFilterTerm, extraFilters);

    const countTerm = filterTerm ? `$expand=${toExpand}&$filter=(${filterTerm})` : '';
    const totalCountTerm = certificatePreFilter ? `$expand=${toExpand}&$filter=(${certificatePreFilter})` : '';

    return Promise.all([
        CommonLibrary.getEntitySetCount(context, RelatedSafetyCertificates(context), countTerm),
        CommonLibrary.getEntitySetCount(context, RelatedSafetyCertificates(context), totalCountTerm),
    ]).then(([count, totalCount]) => context.localizeText('items_x_x', [count, totalCount]));
}

function joinTerms(...terms) {
    return terms
        .filter(i => !!i)
        .join(' and ');
}
