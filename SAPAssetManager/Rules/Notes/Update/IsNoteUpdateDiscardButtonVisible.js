import NotesListLibrary from '../List/NotesListLibrary';

export default function IsNoteUpdateDiscardButtonVisible(context) {
    return !NotesListLibrary.isListNote(context) || NotesListLibrary.isNoteHasChanges(context);
}
