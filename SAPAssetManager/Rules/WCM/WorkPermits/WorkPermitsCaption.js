import CommonLibrary from '../../Common/Library/CommonLibrary';
import { GetSearchStringFilterTerm } from '../Common/ListPageQueryOptionsHelper';
import RelatedWorkPermits from './RelatedWorkPermits';
import { GetRelatedByDataTypeFilterTerm } from './WorkPermitsListViewQueryOption';

export default function WorkPermitsCaption(context) {
    const pageProxy = context.getPageProxy();
    const sectionedTable = pageProxy.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');

    const toExpand = ['WCMApplicationDocuments', 'WCMApplicationUsages,WCMApplicationPartners,WCMApplicationPartners/Employee_Nav'];
    const navigationRelatedFilterTerm = GetRelatedByDataTypeFilterTerm(context);


    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(sectionedTable);
    const extraFilters = GetSearchStringFilterTerm(sectionedTable, sectionedTable?.searchString.toLowerCase(), ['WCMApplication', 'WorkPermitDescr'], 'WCMApplication');

    const filterTerm = [navigationRelatedFilterTerm, sectionedTableFilterTerm, extraFilters].filter(i => !!i).join(' and ');

    const countTerm = filterTerm ? `$expand=${toExpand}&$filter=${filterTerm}` : '';
    const totalCountTerm = navigationRelatedFilterTerm ? `$expand=${toExpand}&$filter=${navigationRelatedFilterTerm}` : '';

    return Promise.all([
        CommonLibrary.getEntitySetCount(context, RelatedWorkPermits(context), countTerm),
        CommonLibrary.getEntitySetCount(context, RelatedWorkPermits(context), totalCountTerm),
    ]).then(([count, totalCount]) => context.localizeText('items_x_x', [count, totalCount]));
}
