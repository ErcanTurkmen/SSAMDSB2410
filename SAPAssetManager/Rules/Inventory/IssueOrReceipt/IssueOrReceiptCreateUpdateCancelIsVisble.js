import libCom from '../../Common/Library/CommonLibrary';

// Cancel Button should not be visible for Bulk Update Scenarios
export default function IssueOrReceiptCreateUpdateCancelIsVisble(context) {
    return !(libCom.getStateVariable(context, 'MaterialDocumentBulkUpdate'));
}
