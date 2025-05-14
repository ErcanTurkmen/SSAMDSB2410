import libCom from '../Common/Library/CommonLibrary';
import { NoteLibrary as libNote } from './NoteLibrary';

export default function NotesFieldGetValue(context) {
    if (libNote.didSetNoteTypeTransactionFlagForPage(context, libCom.getPageName(context))) {
        return libNote.noteDownload(context).then(note => {
            if (note && note.NewTextString) {
                return note.NewTextString;
            }
            return '';
        });
    }
}
