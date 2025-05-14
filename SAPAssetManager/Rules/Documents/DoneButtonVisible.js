import libCom from '../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DoneButtonVisible(context) {
    const navType = libCom.getStateVariable(context, 'DocumentEditorNavType');
    return (navType === 'Attachment');
}
