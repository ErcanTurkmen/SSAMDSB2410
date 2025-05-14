import ODataDate from '../../Common/Date/ODataDate';
import NotesListLibrary from './NotesListLibrary';

export default function NoteTime(context) {
    if (NotesListLibrary.isListNote(context) && context.binding.LastChangeDate) {
        const dateTime = new ODataDate(context.binding.LastChangeDate, context.binding.LastChangeTime);
        return context.formatDatetime(dateTime.toLocalDateTimeString());
    }

    return '';
}
