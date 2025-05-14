import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { GetSearchStringFilterTerm } from '../../Common/ListPageQueryOptionsHelper';
import OperationalItemsCount from '../OperationalItemsCount';
import { OpItemMobileStatusPreFilters } from './OperationalItemsListViewQueryOptions';
import { ADDITIONAL_SEARCH_PROPS } from './OperationalItemsListViewQueryOptions';

/** @param {IPageProxy} context pageproxy of one of the tabpages in OperationalItemsListViewPage */
export default function SetOperationalItemsListCaption(context) {
    const pageProxy = context.getPageProxy();
    const toExpand = 'WCMDocumentHeaders,WCMDocumentHeaders/WCMDocumentPartners,WCMOpGroup_Nav,PMMobileStatus,MyFunctionalLocations';
    const pageName = CommonLibrary.getPageName(context);

    const preFilter = OpItemMobileStatusPreFilters(context)[pageName].map(s => `PMMobileStatus/MobileStatus eq '${s}'`).join(' or ');

    const sectionedTable = pageProxy.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(sectionedTable);
    const stringSearchFilterTerm = GetSearchStringFilterTerm(sectionedTable, sectionedTable?.searchString.toLowerCase(), ADDITIONAL_SEARCH_PROPS, 'WCMDocumentItem');

    const filterTerm = [preFilter, sectionedTableFilterTerm, stringSearchFilterTerm].filter(i => !!i).map(i => `(${i})`).join(' and ');

    const countTerm = filterTerm ? `$expand=${toExpand}&$filter=(${filterTerm})` : '';
    const totalCountTerm = preFilter ? `$expand=${toExpand}&$filter=(${preFilter})` : '';

    return Promise.all([
        OperationalItemsCount(context, countTerm),
        OperationalItemsCount(context, totalCountTerm)])
        .then(([count, totalCount]) => context.localizeText('items_x_x', [count, totalCount]));
}
