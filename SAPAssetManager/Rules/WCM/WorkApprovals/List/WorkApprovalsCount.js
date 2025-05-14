import libCom from '../../../Common/Library/CommonLibrary';

export default function WorkApprovalsCount(context, queryOptions = '') {
    return libCom.getEntitySetCount(context, 'WCMApprovals', queryOptions);
}
