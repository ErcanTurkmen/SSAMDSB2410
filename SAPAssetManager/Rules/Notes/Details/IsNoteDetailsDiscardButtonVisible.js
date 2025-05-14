import NotesListLibrary from '../List/NotesListLibrary';

export default function IsNoteDetailsDiscardButtonVisible(context) {
    return NotesListLibrary.isListNote(context) && NotesListLibrary.isNoteLocal(context) && !NotesListLibrary.isLogNote(context);
}
