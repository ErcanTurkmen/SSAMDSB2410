export default function WorkApprovalsListViewFilters(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'WCMApproval', undefined, ['WCMApproval'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('wcm_work_approval_id')])];
}
