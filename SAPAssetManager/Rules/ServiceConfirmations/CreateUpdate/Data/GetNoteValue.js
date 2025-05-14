import ServiceConfirmationLibrary from '../ServiceConfirmationLibrary';

export default function GetNoteValue() {
    return ServiceConfirmationLibrary.getInstance().getNoteValue();
}
