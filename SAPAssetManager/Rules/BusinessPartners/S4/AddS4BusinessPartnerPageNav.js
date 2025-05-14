import CommonLibrary from '../../Common/Library/CommonLibrary';
import { NoteLibrary } from '../../Notes/NoteLibrary';

export default function AddS4BusinessPartnerPageNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
    NoteLibrary.didSetNoteTypeTransactionFlagForPage(context, 'AddS4BusinessPartnerPage');
    return context.executeAction('/SAPAssetManager/Actions/BusinessPartners/S4/AddS4BusinessPartnerPageNav.action');
}
