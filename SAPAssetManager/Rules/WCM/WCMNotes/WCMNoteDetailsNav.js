import libCom from '../../Common/Library/CommonLibrary';
import NotesViewNav from '../../Notes/NotesViewNav';
import WCMNotesLibrary from './WCMNotesLibrary';

export default function WCMNoteDetailsNav(context, noteType) {
    const type = noteType || context.getPageProxy().getActionBinding();

    libCom.setStateVariable(context, WCMNotesLibrary.noteTypeStateVarName, type);
    context.getPageProxy().setActionBinding(WCMNotesLibrary.getObjectBinding(context));

    return NotesViewNav(context);
}
