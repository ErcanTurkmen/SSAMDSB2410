import libCommon from '../../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType } from '../../../Notes/NoteLibrary';
import Constants from '../../../Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeNote(context) {
    libCommon.setStateVariable(context, 'IsOnRejectOperation', false);

    const pageName = libCommon.getPageName(context);

    if (WorkOrderCompletionLibrary.getInstance().isWOFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder(pageName));
    } else if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation(context, pageName));
    } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation(pageName));
    } else if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceOrder(pageName));
    } else if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceItem(pageName));
    }
    let odata = WorkOrderCompletionLibrary.getInstance().getBinding(context);

    let noteEntitySet = libCommon.getStateVariable(context, Constants.transactionNoteTypeStateVariable).component;

    return NoteLib.noteDownload(context, odata['@odata.id'] + '/' + noteEntitySet).then((note) => {
        libCommon.setStateVariable(context, 'SupervisorNote', true);
        context.getPageProxy().setActionBinding(odata);

        if (note && note.NewTextString) {
            libCommon.setStateVariable(context, Constants.noteStateVariable, note);
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        } else {
            libCommon.setOnCreateUpdateFlag(context, 'CREATE');
            libCommon.setOnChangesetFlag(context, false);
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
        }
    });
}
