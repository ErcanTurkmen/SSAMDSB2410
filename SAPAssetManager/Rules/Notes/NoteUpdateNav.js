import ComLib from '../Common/Library/CommonLibrary';
import NotesListLibrary from './List/NotesListLibrary';
import { NoteLibrary as NoteLib} from './NoteLibrary';

export default function NoteUpdateNav(clientAPI) {
    
    //Set the global TransactionType variable to CREATE
    ComLib.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    //set the CHANGSET flag to false
    ComLib.setOnChangesetFlag(clientAPI, false);

    return NoteLib.noteDownload(clientAPI).then(note => {
        const isListNote = NotesListLibrary.isListNote(clientAPI);

        if (note.NewTextString || isListNote) {
            if (isListNote) {
                note.NewTextString = note.TextString;
            }

            clientAPI.setActionBinding(note);

            return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action').finally(() => {
                ComLib.setOnCreateUpdateFlag(clientAPI, '');
            });
        }

        // We need to do this because linter complains about not having a return 
        return '';
    });
}
