import libCom from '../../Common/Library/CommonLibrary';

export default function SetPurchaseOrderGoodsReceiptReceiveAll(context) {
    libCom.setStateVariable(context,'IMObjectType','PO');
    libCom.setStateVariable(context, 'IMMovementType', 'R'); 
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action');
}
