import libCom from '../../Common/Library/CommonLibrary';

export default function SetProductionOrderComponentsGoodsIssueIssueAll(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'PRD');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action');
}
