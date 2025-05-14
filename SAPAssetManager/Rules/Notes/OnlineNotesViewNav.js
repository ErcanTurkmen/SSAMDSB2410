import { NoteLibrary as NoteLib} from './NoteLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function OnlineNotesViewNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    pageProxy.setActionBinding(pageProxy.binding);
    // Set the transaction type before navigating to the Note View page
    let page = libCom.getPageName(clientAPI);
    
    if (NoteLib.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/OnlineNoteViewNav.action');
    }
    return null;
}
