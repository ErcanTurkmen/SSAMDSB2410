import ApprovalsReadLink from './ApprovalsReadLink';
import { ApprovalsQueryOptionsIssued } from './ApprovalsQueryOptions';

export default function ReceivedApprovalsTarget(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', ApprovalsReadLink(context), [], ApprovalsQueryOptionsIssued());
}
