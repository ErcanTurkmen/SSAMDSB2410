import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';
import BPNoteType from './List/BPNoteType';
import NotesListLibrary from './List/NotesListLibrary';
import NoteType from './List/NoteType';

export default function NotesViewCaption(context) {
    const WCMNoteType = libCom.getStateVariable(context, WCMNotesLibrary.noteTypeStateVarName);
    if (!libVal.evalIsEmpty(WCMNoteType)) {
        return WCMNotesLibrary.getNoteCaption(context, WCMNoteType);
    }

    if (NotesListLibrary.isListNote(context)) {
        if (NotesListLibrary.isBPNote(context)) {
            return BPNoteType(context).then(type => {
                return type || context.localizeText('note');
            });
        }

        return NoteType(context).then(type => {
            return type || context.localizeText('note');
        });
    }

    return context.localizeText('notes');
}
