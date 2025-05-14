import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { OpItemsSubPageFastFilters, OpItemsSubPageNames } from './ConstructOperationalItemsListViewTabs';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';
import { OpItemMobileStatusCodes } from '../libWCMDocumentItem';
import { GetSearchStringFilterTerm } from '../../Common/ListPageQueryOptionsHelper';
import { DQBAndFilterSafe } from '../../Common/DataQueryBuilderUtils';

export const ADDITIONAL_SEARCH_PROPS = Object.freeze([
    'ShortText', 
    'Tag', 
    'MyFunctionalLocations/FuncLocId', 
    'Equipment', 
    'TechObject',
]);

/** @param {ISectionedTableProxy} context */
export default function OperationalItemsListViewQueryOptions(context) {
    const pageName = CommonLibrary.getPageName(context);
    const toExpand = 'WCMDocumentHeaders,WCMDocumentHeaders/WCMDocumentPartners,WCMDocumentHeaders/WCMDocumentPartners/Employee_Nav,WCMOpGroup_Nav,PMMobileStatus,MyFunctionalLocations';
    const retDQB = context.dataQueryBuilder().expand(toExpand);
    const parentPageName = CommonLibrary.getStateVariable(context, 'OperationalItemsListPageName');

    if (Object.keys(OpItemsSubPageFastFilters(context)).includes(pageName)) {  // we are on the OperationalItems List page
        const prefilters = OpItemMobileStatusPreFilters(context)[pageName];
        if (!ValidationLibrary.evalIsEmpty(prefilters)) {
            const preFilter = prefilters.map(s => `PMMobileStatus/MobileStatus eq '${s}'`);
            retDQB.filter().or(...preFilter);
        }

        FilterLibrary.setFilterActionItemText(context, context.evaluateTargetPath(`#Page:${parentPageName}`), context);

        const stringSearchFilterTerm = GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ADDITIONAL_SEARCH_PROPS, 'WCMDocumentItem');
        DQBAndFilterSafe(retDQB, stringSearchFilterTerm);
    }

    if (pageName === 'WCMOverviewPage' || pageName === 'SafetyCertificateDetailsPage') {
        retDQB.top(4);
    }

    if (pageName === 'SafetyCertificateDetailsPage' || (pageName === parentPageName && context.binding)) {
        retDQB.orderBy('Sequence');
    }

    return retDQB;
}

export function OpItemMobileStatusPreFilters(context) {
    const subpageNames = OpItemsSubPageNames(context);
    return {
        [subpageNames.all_items]: [],
        [subpageNames.tagging]: [OpItemMobileStatusCodes.InitialTaggingStatus, OpItemMobileStatusCodes.Tag, OpItemMobileStatusCodes.TagPrinted],
        [subpageNames.untagging]: [OpItemMobileStatusCodes.Untag, OpItemMobileStatusCodes.Tagged],
    };
}
