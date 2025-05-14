import libCom from '../../Common/Library/CommonLibrary';

export default function GetRelatedWCMApprovalsCount(context) {
    return libCom.getEntitySetCount(context, `${context.getPageProxy().binding['@odata.readLink']}/WCMApprovalApplications`, '');
}
