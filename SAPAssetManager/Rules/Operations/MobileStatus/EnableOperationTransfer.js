import libCommon from '../../Common/Library/CommonLibrary';

export default function EnableOperationTransfer(context) {
    return !['4', 'A'].includes(libCommon.getWorkOrderAssignmentType(context)) && !libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
}
