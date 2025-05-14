import { GetSearchStringFilterTerm, ListPageGetCombinedQueryOptions } from '../../Common/ListPageQueryOptionsHelper';
import libFilter from '../../../Filter/FilterLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';


export default function WorkApprovalsListViewQueryOption(context) {
    const toExpand = ['WCMSystemStatuses', 'WCMApprovalApplications'];
    const navigationRelatedFilterTerms = [GetRelatedSafetyCertificateFilterTerm(context.binding)];
    const extraFilters = [GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMApproval', 'ShortText'], 'WCMApproval')];

    libFilter.setFilterActionItemText(context, context.evaluateTargetPath(`#Page:${CommonLibrary.getPageName(context.getPageProxy())}`), context);

    return ListPageGetCombinedQueryOptions(context, toExpand, navigationRelatedFilterTerms, extraFilters);
}

export function GetRelatedSafetyCertificateFilterTerm(binding) { // if navigated from work permit details page
    return binding && binding['@odata.type'] === '#sap_mobile.WCMApplication' ? `WCMApprovalApplications/any(i:i/WCMApplication eq '${binding.WCMApplication}')` : '';
}
