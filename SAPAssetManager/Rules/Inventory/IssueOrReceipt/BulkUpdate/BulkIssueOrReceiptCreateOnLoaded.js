import libCom from '../../../Common/Library/CommonLibrary';
import BulkUpdateValidateIssueOrReceipt from './BulkUpdateValidateIssueOrReceipt';
export default function BulkIssueOrReceiptCreateOnLoaded(context) {
    if (libCom.getStateVariable(context, 'BulkUpdateFinalSave') === false) {
        BulkUpdateValidateIssueOrReceipt(context);
    }
}
