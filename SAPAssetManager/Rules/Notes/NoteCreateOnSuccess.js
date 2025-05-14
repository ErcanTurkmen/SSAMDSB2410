import libCommon from '../Common/Library/CommonLibrary';
import {NoteLibrary as NoteLib} from './NoteLibrary';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import NotesListLibrary from './List/NotesListLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function NoteCreateOnSuccess(context) {

    if (context.binding && IsCompleteAction(context) &&
        (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' || context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' || 
        context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation' || context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder' || 
        context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem')) {
        return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
    }

    if (!libCommon.isOnWOChangeset(context)) {
        let onChangeSet = libCommon.isOnChangeset(context);

        if (onChangeSet) {
            libCommon.incrementChangeSetActionCounter(context);
            context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        } else if (['ServiceOrderCreateUpdatePage', 'ServiceRequestCreateUpdatePage', 'ServiceQuotationCreateUpdatePage'].includes(libCommon.getPageName(context))) { // if we are on service order/request/quotation update, we don't want to show note create success message
            return Promise.resolve();
        } else if (NotesListLibrary.isListNote(context) && context.binding?.NewTextString) {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Notes/NoteUpdateSuccessMessage.action');
        } else {
            return NoteLib.createSuccessMessage(context);
        }
    }
}
