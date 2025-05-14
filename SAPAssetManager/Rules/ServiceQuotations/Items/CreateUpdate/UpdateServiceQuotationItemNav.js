import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { NoteLibrary } from '../../../Notes/NoteLibrary';

export default function UpdateServiceQuotationItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
    NoteLibrary.didSetNoteTypeTransactionForBindingType(context);
    return context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/Items/CreateUpdateServiceQuotationItemNav.action');
}
