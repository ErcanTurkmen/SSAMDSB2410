import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorCancelVisible(context) {
    const navType = libCom.getStateVariable(context, 'DocumentEditorNavType');
    return navType !== 'Attachment';
}
