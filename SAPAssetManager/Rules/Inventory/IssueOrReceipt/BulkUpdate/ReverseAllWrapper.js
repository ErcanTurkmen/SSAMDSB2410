import libCom from '../../../Common/Library/CommonLibrary';
import { GoodsMovementCode } from '../../Common/Library/InventoryLibrary';
import { navigateToCreateMaterialDocument } from '../BulkUpdate/BulkIssueOrReceiptPost';
export default function ReverseAllWrapper(context) {
    let binding = context.getPageProxy().getActionBinding()?.MaterialDocument_Nav || context.getPageProxy().binding;
    let messageText = context.localizeText('reverse_all_warning_x',[binding.MaterialDocNumber]);
    let captionText = context.localizeText('warning');

    //Prompt user with issue all warning dialog
    return libCom.showWarningDialog(context, messageText, captionText).then(result => {
        if (result === true) {
            //Figure out binding properties
            libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
            libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
            libCom.removeStateVariable(context, 'ReverseAllItemId');
            
            binding.TempHeader_DocumentDate = '';
            binding.TempHeader_PostingDate = '';
            binding.TempHeader_HeaderText = '';
            binding.TempHeader_DeliveryNote = '';
            binding.TempHeader_GMCode = GoodsMovementCode.Reversal;
            libCom.removeStateVariable(context, 'CancelActionFlag');
            context.getPageProxy().setActionBinding(binding);
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ReceiptReceiveAllCreateChangeset.action').then(() => {
                return navigateToCreateMaterialDocument(context);
            });
        }
        return false;
    }).catch(function() {
        return false; //User terminated out of warning dialog
    });
}
