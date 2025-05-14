import { AcyclicNavigate } from '../../Common/AcyclicNavigate';

export default function WorkApprovalDetailsNav(context) {
    return AcyclicNavigate(context, 'WorkApprovalDetailsPage', '/SAPAssetManager/Actions/WCM/WorkApprovals/WorkApprovalDetailsNav.action', (prevBinding, currBinding) => prevBinding.WCMApproval === currBinding.WCMApproval, 2);
}
