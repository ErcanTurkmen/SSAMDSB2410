import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsWCMWorkPermitEnabled from '../../UserFeatures/IsWCMWorkPermitEnabled';


export default function WCMWorkApprovalsVisible(context) {
    return IsWCMWorkPermitEnabled(context) && CommonLibrary.getAppParam(context, 'WCM', 'Approval.Show') === 'Y';
}
