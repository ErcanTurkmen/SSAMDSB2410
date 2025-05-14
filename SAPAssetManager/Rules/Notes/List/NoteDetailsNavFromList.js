import { NoteLibrary } from '../NoteLibrary';

export default function NoteDetailsNavFromList(context) {
    NoteLibrary.didSetNoteTypeTransactionForBindingType(context, context.getPageProxy().getActionBinding());
    return context.executeAction('/SAPAssetManager/Actions/Notes/NoteViewNav.action');
}
