import libCom from '../../Common/Library/CommonLibrary';

export default function SetReservationGoodsIssueIssueAll(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'RES');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptGenericFieldsCreateNav.action');
}
