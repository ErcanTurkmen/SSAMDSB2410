import WCMNotesLibrary from './WCMNotesLibrary';

export default function WCMNoteTypeCaption(context) {
    return WCMNotesLibrary.getNoteCaption(context, context.binding.TextType);
}
