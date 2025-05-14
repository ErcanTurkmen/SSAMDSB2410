import libCom from '../Common/Library/CommonLibrary';
import documentOverwrite from './DocumentEditorOverwrite';

export default function DocumentEditorSave(context) {
    libCom.setStateVariable(context, 'DocumentEdited', true);
    const navType = libCom.getStateVariable(context, 'DocumentEditorNavType');
    if (navType === 'Attachment') {
        return documentOverwrite(context);
    } else if (navType === 'DocumentList') {
        return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorSavePopover.action');
    }
    return Promise.resolve();
}
