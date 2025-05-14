import { DocumentHelper } from '../InboundOrOutbound/UpdateHeaderCountItems';
import createIssueorReceiptSignature from './IssueOrReceiptSignatureCreate';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptAttachmentSignature(context) {

    //set create flag 
    CommonLibrary.setStateVariable(context, 'TransactionType', 'CREATE');
    //create attachment
    DocumentHelper(context)
    //create signature
    .then(() => createIssueorReceiptSignature(context))
    //clear create flag
    .then(() =>  CommonLibrary.clearStateVariable(context, 'TransactionType'));

}
