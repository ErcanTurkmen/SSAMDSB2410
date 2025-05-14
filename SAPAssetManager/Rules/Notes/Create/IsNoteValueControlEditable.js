import NoteTypeControlLibrary from './NoteTypeControlLibrary';

export default function IsNoteValueControlEditable(control) {
    const pageProxy = control.getPageProxy();
    if (NoteTypeControlLibrary.isNoteTypeControlVisible(pageProxy)) {
        return !!NoteTypeControlLibrary.getNoteTypeControlValue(pageProxy);
    }

    return true;
}
