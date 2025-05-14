import { NoteLibrary as NoteLib} from './NoteLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function NotesViewNav(clientAPI) {
    // Set the transaction type before navigating to the Note View page
    let page = libCom.getPageName(clientAPI);
    if (page === 'WCMNotesListPage') {
        page = libCom.getPageName(clientAPI.evaluateTargetPathForAPI('#Page:-Previous'));
    }
    
    if (NoteLib.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteViewNav.action');
    }
    return null;
}
