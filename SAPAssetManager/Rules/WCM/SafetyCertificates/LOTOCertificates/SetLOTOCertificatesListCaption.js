import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { GetSearchStringFilterTerm } from '../../Common/ListPageQueryOptionsHelper';
import { LOTOCertificatePreFilters } from '../LOTOCertificatesListViewQueryOption';
import SafetyCertificatesLibrary from '../SafetyCertificatesLibrary';

/** @param {IPageProxy} context pageproxy of one of the tabpages in LOTOCertificatesListViewPage */
export default function SetLOTOCertificatesListCaption(context) {
    const toExpand = 'WCMApplicationDocuments,WCMDocumentPartners';
    const pageProxy = context.getPageProxy();
    const pageName = CommonLibrary.getPageName(context);

    const sectionedTable = pageProxy.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(sectionedTable);
    const preFilter = SafetyCertificatesLibrary.createQueryStringFromCriterias(LOTOCertificatePreFilters[pageName]);
    const extraFilters = GetSearchStringFilterTerm(sectionedTable, sectionedTable?.searchString.toLowerCase(), ['WCMDocument', 'ShortText'], 'WCMDocumentHeader');

    const filterTerm = [preFilter, sectionedTableFilterTerm, extraFilters]
        .filter(i => !!i)
        .join(' and ');

    const countTerm = filterTerm ? `$expand=${toExpand}&$filter=${filterTerm}` : '';
    const totalCountTerm = preFilter ? `$expand=${toExpand}&$filter=(${preFilter})` : '';

    return Promise.all([
        CommonLibrary.getEntitySetCount(context, 'WCMDocumentHeaders', countTerm),
        CommonLibrary.getEntitySetCount(context, 'WCMDocumentHeaders', totalCountTerm),
    ]).then(([count, totalCount]) => context.localizeText('items_x_x', [count, totalCount]));
}
