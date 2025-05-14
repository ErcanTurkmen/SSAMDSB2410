import DiscardNoteAction from '../Delete/DiscardNoteAction';
import { NoteLibrary } from '../NoteLibrary';

export default function NoteDiscardFromContextMenu(context) {
    NoteLibrary.didSetNoteTypeTransactionForBindingType(context, context.getPageProxy().getActionBinding());
    return DiscardNoteAction(context);
}
