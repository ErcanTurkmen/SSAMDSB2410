import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function HeaderTextIsEditable(context) {
    let editable = true;
    let data = CommonLibrary.getStateVariable(context, 'FixedData');
    let docId = CommonLibrary.getStateVariable(context, 'ActualDocId');
    let created = CommonLibrary.getStateVariable(context, 'IsAlreadyCreatedDoc');
    if (data && data.headerNote) {
        editable = false;
    }
    if (docId || created) {
        editable = false;
    }
    return editable;
}
