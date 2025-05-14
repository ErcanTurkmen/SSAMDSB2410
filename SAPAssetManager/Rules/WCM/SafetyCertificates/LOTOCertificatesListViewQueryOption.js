import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import FilterLibrary from '../../Filter/FilterLibrary';
import { DQBAndFilterSafe } from '../Common/DataQueryBuilderUtils';
import { GetSearchStringFilterTerm } from '../Common/ListPageQueryOptionsHelper';
import { LOTOCertsSubPageNames } from './LOTOCertificates/ConstructLOTOCertificatesListViewTabs';
import SafetyCertificatesLibrary, { WCMCertificateMobileStatuses } from './SafetyCertificatesLibrary';

/** @param {ISectionedTableProxy} context  */
export default function LOTOCertificatesListViewQueryOption(context) {
    const pageName = CommonLibrary.getPageName(context);
    const retDQB = context.dataQueryBuilder().expand('WCMApplicationDocuments,WCMDocumentPartners,WCMDocumentPartners/Employee_Nav,WCMDocumentItems/PMMobileStatus');

    if (!ValidationLibrary.evalIsEmpty(LOTOCertificatePreFilters[pageName])) {
        const preFilter = SafetyCertificatesLibrary.createQueryStringFromCriterias(LOTOCertificatePreFilters[pageName]);
        retDQB.filter(preFilter);
    }

    FilterLibrary.setFilterActionItemText(context, context.evaluateTargetPath('#Page:LOTOCertificatesListViewPage'), context);

    const stringSearchFilterTerm = GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMDocument', 'ShortText'], 'WCMDocumentHeader');
    DQBAndFilterSafe(retDQB, stringSearchFilterTerm);

    return retDQB;
}

export const LOTOCertificatePreFilters = Object.freeze({
    [LOTOCertsSubPageNames.all_items]: [...SafetyCertificatesLibrary.getLOTOCertificatesFiltersCriteria()],
    [LOTOCertsSubPageNames.tagging]: [...SafetyCertificatesLibrary.getLOTOCertificatesFiltersCriteria(), {
        field: 'PMMobileStatus/MobileStatus',
        values: [WCMCertificateMobileStatuses.Prepared, WCMCertificateMobileStatuses.Tag, WCMCertificateMobileStatuses.Tagprint],
    }],
    [LOTOCertsSubPageNames.untagging]: [...SafetyCertificatesLibrary.getLOTOCertificatesFiltersCriteria(), {
        field: 'PMMobileStatus/MobileStatus',
        values: [WCMCertificateMobileStatuses.Untag, WCMCertificateMobileStatuses.Tagged],
    }],
});
