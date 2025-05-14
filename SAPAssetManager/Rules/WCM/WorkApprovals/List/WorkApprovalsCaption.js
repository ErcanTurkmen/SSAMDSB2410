import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { GetSearchStringFilterTerm } from '../../Common/ListPageQueryOptionsHelper';
import { GetRelatedSafetyCertificateFilterTerm } from './WorkApprovalsQueryOptions';

export default function WorkApprovalsCaption(context) {
    const pageProxy = context.getPageProxy();
    const sectionedTable = pageProxy.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const toExpand = ['WCMSystemStatuses', 'WCMApprovalApplications'].join(',');
    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(sectionedTable);
    const navigationRelatedFilterTerm = GetRelatedSafetyCertificateFilterTerm(pageProxy.binding);
    const extraFilters = GetSearchStringFilterTerm(sectionedTable, sectionedTable?.searchString.toLowerCase(), ['WCMApproval', 'ShortText'], 'WCMApproval');

    const filterTerm = [navigationRelatedFilterTerm, sectionedTableFilterTerm, extraFilters].filter(i => !!i).join(' and ');

    const countTerm = filterTerm ? `$expand=${toExpand}&$filter=${filterTerm}` : '';
    const totalCountTerm = navigationRelatedFilterTerm ? `$expand=${toExpand}&$filter=${navigationRelatedFilterTerm}` : '';

    return Promise.all([
        CommonLibrary.getEntitySetCount(context, 'WCMApprovals', countTerm),
        CommonLibrary.getEntitySetCount(context, 'WCMApprovals', totalCountTerm),
    ]).then(([count, totalCount]) => context.localizeText('items_x_x', [count, totalCount]));
}
