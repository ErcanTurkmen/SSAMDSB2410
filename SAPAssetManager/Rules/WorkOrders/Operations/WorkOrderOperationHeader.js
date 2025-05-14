import libForm from '../../Common/Library/FormatLibrary';

/** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
export default function WorkOrderOperationHeader(context) {
    return libForm.formatDetailHeaderDisplayValue(context, context.binding.OperationNo, context.localizeText('operation'));
}
