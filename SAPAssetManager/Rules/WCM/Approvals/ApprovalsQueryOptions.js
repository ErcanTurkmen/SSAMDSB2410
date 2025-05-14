export const APPROVALS_FILTER = {
    received: "WCMApprovalProcessSegments/any(seg: seg/SegmentInactive eq '')",
    pending: "WCMApprovalProcessSegments/all(seg: seg/SegmentInactive ne '')",
};


const baseQueryOptions = '$expand=WCMApprovalProcessSegments,WCMApprovalProcessLongtexts,WCMApplications,WCMDocumentHeaders&$orderby=Counter';

export function ApprovalsQueryOptionsPending() {
    return `${baseQueryOptions}&$filter=WCMApprovalProcessSegments/all(seg: seg/SegmentInactive ne '')`;// there isn't any active processSegment (==approve)
}

export function ApprovalsQueryOptionsIssued() {
    return `${baseQueryOptions}&$filter=WCMApprovalProcessSegments/any(seg: seg/SegmentInactive eq '')`;
}
