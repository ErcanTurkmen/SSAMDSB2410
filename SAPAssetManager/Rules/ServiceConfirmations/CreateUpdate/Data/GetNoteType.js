import ServiceConfirmationLibrary from '../ServiceConfirmationLibrary';

export default function GetNoteType() {
    return ServiceConfirmationLibrary.getInstance().getNoteType();
}
