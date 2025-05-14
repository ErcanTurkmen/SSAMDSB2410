import CommonLibrary from '../../Common/Library/CommonLibrary';
import { GetSearchStringFilterTerm, ListPageGetCombinedQueryOptions } from '../Common/ListPageQueryOptionsHelper';
import libFilter from '../../Filter/FilterLibrary';
import { WorkOrderDetailsPageName } from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';


export default function WorkPermitsListViewQueryOption(context) {
    const pageName = CommonLibrary.getPageName(context);
    const toExpand = ['WCMApplicationDocuments', 'WCMApplicationUsages,WCMApplicationPartners,WCMApplicationPartners/Employee_Nav'];
    const navigationRelatedFilterTerms = [GetRelatedByDataTypeFilterTerm(context)].filter(x => !!x);
    const permitListPageNames = ['WorkPermitsListViewPage', 'ApprovalRelatedWorkPermitListPage', 'CertificateRelatedWorkPermitListPage', 'EquipmentRelatedWorkPermitListPage', 'FlocRelatedWorkPermitListPage', 'WorkOrderRelatedWorkPermitListPage'];
    if (!permitListPageNames.includes(pageName)) {
        const queryBuilder = context.dataQueryBuilder();
        queryBuilder.expand(toExpand);
        if (pageName === 'WCMOverviewPage') {
            queryBuilder.top(4);
        }
        if (pageName === WorkOrderDetailsPageName(context) || pageName === 'WorkApprovalDetailsPage') {
            queryBuilder.top(2);
            navigationRelatedFilterTerms.forEach(term => {
                if (queryBuilder.hasFilter) {
                    queryBuilder.filter().and(term);
                } else {
                    queryBuilder.filter(term);
                }
            });
        }
        return queryBuilder;
    }
    const extraFilters = [GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMApplication', 'WorkPermitDescr'], 'WCMApplication')];

    libFilter.setFilterActionItemText(context, context.evaluateTargetPath(`#Page:${CommonLibrary.getPageName(context.getPageProxy())}`), context);

    return ListPageGetCombinedQueryOptions(context, toExpand, navigationRelatedFilterTerms, extraFilters);
}

//filtering for display Related Work Permits
export function GetRelatedByDataTypeFilterTerm(context) {
    const binding = context.binding;
    const dataType = binding && binding['@odata.type'];

    switch (dataType) {
        case '#sap_mobile.WCMDocumentHeader':
            return `WCMApplicationDocuments/any(i:i/WCMDocument eq '${binding.WCMDocument}')`;
        case '#sap_mobile.MyWorkOrderHeader':
            return `WCMApplicationOrders/any(i:i/Order eq '${binding.OrderId}')`;
        case '#sap_mobile.WCMApproval':
            return `WCMApprovalApplications/any(i:i/WCMApproval eq '${binding.WCMApproval}')`;
        default:
            return '';
    }
}
