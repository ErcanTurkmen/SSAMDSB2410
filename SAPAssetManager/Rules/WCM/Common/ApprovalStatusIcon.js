import { GetApprovalStatus } from './GetApprovalStatus';
import TrafficLightStatusIcon from './TrafficLightStatusIcon';

export default function ApprovalStatusIcon(context) {
    return GetApprovalStatus(context).then(status => TrafficLightStatusIcon(context, status));
}
