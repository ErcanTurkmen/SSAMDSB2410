import { GetApprovalSegment } from './ApprovalInfoFormat';

export default async function ApprovalStatus(context) {
    const approvalSegment = await GetApprovalSegment(context);
    return context.localizeText(approvalSegment ? 'issued' : 'pending');
}
