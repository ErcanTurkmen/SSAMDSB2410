import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';

export default function NotesViewOnUnloaded(context) {
    if (!libVal.evalIsEmpty(libCom.getStateVariable(context, WCMNotesLibrary.noteTypeStateVarName))) {
        libCom.removeStateVariable(context, WCMNotesLibrary.noteTypeStateVarName);
    }
}
