import {ValueIfExists} from '../Common/Library/Formatter';

export default function DocumentEditorSaveAsDescription(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.Document.Description);
}
