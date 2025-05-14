import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { NoteLibrary } from '../../../Notes/NoteLibrary';

export default function CreateServiceQuotationItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context.getPageProxy(), 'CREATE');
    NoteLibrary.didSetNoteTypeTransactionFlagForPage(context, 'CreateUpdateServiceQuotationItem');
    return context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/Items/CreateUpdateServiceQuotationItemNav.action');
}
