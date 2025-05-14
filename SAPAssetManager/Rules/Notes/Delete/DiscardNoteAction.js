import {NoteLibrary as NoteLib} from '../NoteLibrary';
import ComLib from '../../Common/Library/CommonLibrary';
import Constants from '../../Common/Library/ConstantsLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import NotesListLibrary from '../List/NotesListLibrary';
import IsSyncInProgress from '../../Sync/IsSyncInProgress';

export default function DiscardNoteAction(context) {
    const previousPageName = ComLib.getPageName(context.evaluateTargetPathForAPI('#Page:-Previous'));
    const isNotLocal = NotesListLibrary.isListNote(context) && !ComLib.isCurrentReadLinkLocal(context.binding['@odata.readLink']);

    const discardAction = '/SAPAssetManager/Actions/Notes/NoteDiscardDialog.action';
    const resetAction = '/SAPAssetManager/Actions/Notes/NoteResetDialog.action';
    //finding object type. Using split as the data is coming as "@sap_mobile.EntityName"
    return context.executeAction(isNotLocal ? resetAction : discardAction).then(result => {
        if (result.data === true) {
            let transaction = NoteLib.getNoteTypeTransactionFlag(context);
            if (transaction.noteDeleteAction) {
                ComLib.setStateVariable(context, Constants.stripNoteNewTextKey, true);
                if (IsSyncInProgress(context)) {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
                }
                return context.executeAction(transaction.noteDeleteAction).then(() => {
                    if (IsCompleteAction(context)) {
                        WorkOrderCompletionLibrary.updateStepState(context, 'note', {
                            data: '',
                            value: '',
                            link: '',
                        });
                        return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
                    }

                    return finalizeDiscardAction(context, previousPageName);
                });
            }
        }
        return Promise.resolve();
    });
}

function finalizeDiscardAction(context, previousPageName) {
    // Discard button can be clicked:
    // on NoteUpdate page opened from NotesView page: extra page close is required
    // on NoteUpdate page opened from NotesListView page: extra page close is not required
    // on NoteUpdate page opened from BP's parent details page: extra page close is not required
    // on NotesView page: extra page close is not required
    // via ContextMenu from NotesListView page: extra page close is not required
    const currentPage = ComLib.getPageName(context);
    
    if (NotesListLibrary.isListNote(context) && currentPage === 'NoteUpdate' && previousPageName === 'NotesView') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
    return Promise.resolve();
}
