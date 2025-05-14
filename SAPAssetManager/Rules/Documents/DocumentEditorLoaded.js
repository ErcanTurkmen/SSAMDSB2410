import libCom from '../Common/Library/CommonLibrary';

/**
* setting value if we need to remove attachment from temp directory on cancel action
* @param {IClientAPI} context
*/
export default function DocumentEditorLoaded(context) {
    const noDeleteDoc = libCom.getStateVariable(context, 'DocumentEditorNavFromCell');
    context.getPageProxy().getClientData().needsDelete = !noDeleteDoc;
    libCom.removeStateVariable(context, 'DocumentEditorNavFromCell');
}
