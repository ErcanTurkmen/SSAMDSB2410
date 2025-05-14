import CommonLibrary from '../Common/Library/CommonLibrary';

export default function NoteGetObjectId(context) {
    let binding = context.getBindingObject();
    if (CommonLibrary.getStateVariable(context, 'contextMenuSwipePage')) {
        binding = CommonLibrary.getBindingObject(context);
    }
    return binding.ObjectID;
}
