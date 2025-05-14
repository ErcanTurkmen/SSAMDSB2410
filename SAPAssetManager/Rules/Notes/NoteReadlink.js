import Constants from '../Common/Library/ConstantsLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function NoteReadlink(context) {
    const menuItemContext = context.getExecutedContextMenuItem && context.getExecutedContextMenuItem();
    if (menuItemContext?.binding) {
        return menuItemContext.binding['@odata.readLink'];
    }
    let note = libCommon.getStateVariable(context, Constants.noteStateVariable);
    if (note) {            
        return note['@odata.readLink'];
    }
    return '';

}
