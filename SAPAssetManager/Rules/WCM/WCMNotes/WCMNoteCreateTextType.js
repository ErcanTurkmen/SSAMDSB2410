import WCMNotesLibrary from './WCMNotesLibrary';

export default function WCMNoteCreateTextType(context) {
    return WCMNotesLibrary.getNoteTextTypeForCreation(context);
}
