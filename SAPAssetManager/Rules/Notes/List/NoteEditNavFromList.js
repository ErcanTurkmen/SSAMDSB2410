import { NoteLibrary } from '../NoteLibrary';
import NoteUpdateNav from '../NoteUpdateNav';
import NotesListLibrary from './NotesListLibrary';

export default function NoteEditNavFromList(context) {
    if (NotesListLibrary.isLogNote(context)) return Promise.reject();

    NoteLibrary.didSetNoteTypeTransactionForBindingType(context, context.getPageProxy().getActionBinding());
    return NoteUpdateNav(context.getPageProxy());
}
