import libCom from '../../Common/Library/CommonLibrary';

export default function SetSTOGoodsIssueIssueAll(context) {
    libCom.setStateVariable(context,'IMObjectType','STO');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action');
}
