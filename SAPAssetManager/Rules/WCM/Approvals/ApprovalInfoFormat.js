import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import libCommon from '../../Common/Library/CommonLibrary';

export default async function ApprovalInfoFormat(context, keyName) {
    const approvalSegment = await GetApprovalSegment(context);
    const expr = keyName || context.getProperty();

    if (!approvalSegment && expr !== 'Footnote') {
        return '-';
    }

    const date = approvalSegment && new OffsetODataDate(context, approvalSegment.CreatedOn, approvalSegment.EnteredAt);

    switch (expr) {
        case 'Footnote':
        case 'IssuedBy': {
            if (!approvalSegment) {
                return context.binding.canBeIssued ? context.localizeText('waiting_for_your_approval') : '';
            }

            return context.read('/SAPAssetManager/Services/AssetManager.service', `SAPUsers('${approvalSegment.EnteredBy}')`, [], '').then((data) => {
                const user = data.getItem(0);
                const userInfo = user ? `${user.UserName} (${user.UserId})` : '-';
                if (keyName) {
                    return userInfo;
                }
                return context.localizeText('issued_by_x', [userInfo]);
            });
        }
        case 'StatusText':
            return date && context.formatDate(date.date(), '', '', { format: 'medium' });
        case 'SubstatusText':
            return date && context.formatTime(date.date(), '', '', { format: 'short' });
        case 'IssueDate':
            return date && context.formatDatetime(date.date());
    }
}

/** @return {Promise<WCMApprovalProcessSegment?>} */
export async function GetApprovalSegment(context) {
    const approvalSegments = libCommon.getPageName(context) === 'ApprovalDetailsPage' ?
        await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMApprovalProcessSegments`, [], '') :
        context.binding.WCMApprovalProcessSegments;
    const approvalSegment = approvalSegments.find((item) => item.SegmentInactive === '');
    return approvalSegment;
}
