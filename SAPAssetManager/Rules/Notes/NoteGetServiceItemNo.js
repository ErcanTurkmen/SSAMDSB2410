import libCommon from '../Common/Library/CommonLibrary';

export default function NoteGetServiceItemNo(context) {
    let bindingObj = context.getBindingObject();
    if (libCommon.getStateVariable(context, 'contextMenuSwipePage')) {
        bindingObj = libCommon.getBindingObject(context);
    }
    return bindingObj.ItemNo;
}
