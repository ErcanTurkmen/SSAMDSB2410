import receiveAll from '../IssueOrReceipt/ReceiptReceiveAllCreatePost';
import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import issueAll from '../IssueOrReceipt/IssueAllCreatePost';
import ReverseAll from '../IssueOrReceipt/ReverseAll';
export default function MaterialDocumentCreateUpdatePostWrapper(context) {    

    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let binding = context.binding.AssociatedMaterialDoc;
    if (type !== 'MaterialDocItem' && type !== 'MaterialDocument' && !binding) { //This is not a material document being updated, so run the receive/issue all routine
        if (movementType === 'R') {
            return receiveAll(context); 
        } else if (movementType === 'I') {
            return issueAll(context);
        }
    } else if (type === 'MaterialDocument' || !binding) {
        binding = context.binding;
    }
    let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (!isLocal && type === 'MaterialDocument') {
        return ReverseAll(context);
    }
   

    //Update this material document
    binding.TempHeader_DocumentDate = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate(libCom.getControlProxy(context,'PostingDate').getValue()).toLocalDateString();
    binding.TempHeader_HeaderText = libCom.getControlProxy(context,'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context,'DeliveryNoteSimple').getValue();
    binding.TempHeader_MatDocReadLink = binding['@odata.readLink'];
    binding.TempHeader_Key = binding.MaterialDocNumber;
    context.setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentUpdate.action').then(() => {
        //Close screen and show success popup
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
    });

}
