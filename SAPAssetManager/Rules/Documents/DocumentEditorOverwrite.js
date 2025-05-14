
import libCom from '../Common/Library/CommonLibrary';
import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorOverwrite(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            const fileInfo = getFileInfo(context);
            libCom.setStateVariable(context, 'DocumentEditorSaveType', fileInfo.IsDeleteAllowed ? 'Recreate' : 'Overwrite');
            extension.saveFile(fileInfo);
            context.showActivityIndicator();
        }
    }
}
