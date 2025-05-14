import { ValueIfExists } from '../Common/Library/Formatter';
import { NoteLibrary as NoteLib} from './NoteLibrary';

export default function OnlineNoteViewValue(clientAPI) {
    // This method operates under the assumption Note Transaction Type has already been set    
    return NoteLib.noteDownloadValue(clientAPI, '', '', true).then(result => {
        return ValueIfExists(result);
    });
}

