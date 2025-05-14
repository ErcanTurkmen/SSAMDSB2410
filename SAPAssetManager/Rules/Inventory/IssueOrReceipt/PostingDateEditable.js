import libCom from '../../Common/Library/CommonLibrary';
export default function PostingDateEditable(context) {
    let editable = true;
    let data = libCom.getStateVariable(context, 'FixedData');
    let docId = libCom.getStateVariable(context, 'ActualDocId');
    let created = libCom.getStateVariable(context, 'IsAlreadyCreatedDoc');
    if (data && data.postingDate) {
        editable = false;
    }
    if (docId || created) {
        editable = false;
    }
    return editable;
}
