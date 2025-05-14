import {NoteLibrary as NoteLib} from './NoteLibrary';
import Validate from '../Common/Library/ValidationLibrary';
import NotesListLibrary from './List/NotesListLibrary';

export default function NotesViewOnReturning(context) {
    if (NotesListLibrary.isListNote(context)) return Promise.resolve();

    return NoteLib.noteDownload(context).then(note => {
        let isNoteEditVisible = (note && !Validate.evalIsEmpty(note.NewTextString));
        // Hide/ Display the edit action
        context.setActionBarItemVisible(0, isNoteEditVisible);
    });
}
