import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationsToolbarButtonCaption(context) {
    const assignmentType = libCommon.getWorkOrderAssnTypeLevel(context);
    if (assignmentType === 'Header') {
        return context.localizeText('confirm');
    } else if (assignmentType === 'Operation' || assignmentType === 'SubOperation') {
        return context.localizeText('complete');
    }

    return context.localizeText('confirm');
}
