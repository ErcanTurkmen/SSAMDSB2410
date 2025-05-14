export default function WorkApprovalsFilterPageNav(context) {
    context.setActionBinding({ DefaultValues: { SortFilter: 'WCMApproval' } });
    return context.executeAction('/SAPAssetManager/Actions/WCM/WorkApprovalsFilter.action');
}
