import WorkApprovalsCount from '../WCM/WorkApprovals/List/WorkApprovalsCount';

export default function SideDrawerWorkApprovalsCount(context) {
    return WorkApprovalsCount(context).then(count=>{
        return context.localizeText('work_approvals_x', [count]);
    });
}
