import NotesListLibrary from '../List/NotesListLibrary';

export default function NoteDiscardButtonTitle(context) {
    if (NotesListLibrary.isListNote(context)) {
        if (NotesListLibrary.isNoteLocal(context)) {
            return context.localizeText('discard');
        } else {
            return context.localizeText('reset');
        }    
    }

    return context.localizeText('discard');
}
