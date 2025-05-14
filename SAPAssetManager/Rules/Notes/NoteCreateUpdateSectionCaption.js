import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import noteFieldCaption from '../Supervisor/TechnicianRole/NoteFieldCaption';
import NotesListLibrary from './List/NotesListLibrary';
import IsAndroid from '../Common/IsAndroid';

export default function NoteCreateUpdateSectionCaption(context) {  
    if (NotesListLibrary.isListNote(context)) return context.localizeText('indicates_required_fields');
    if (IsAndroid(context)) return null;
    
    const noteTextTypeWCM = WCMNotesLibrary.getNoteTextTypeForCreation(context);
    if (!libVal.evalIsEmpty(noteTextTypeWCM)) {
        return WCMNotesLibrary.getNoteCaption(context, noteTextTypeWCM);
    }
  
    return noteFieldCaption(context);
}
