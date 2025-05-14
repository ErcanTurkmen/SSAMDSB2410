
import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorCaption(context) {
    const fileInfo = getFileInfo(context);
    if (fileInfo) {
        return fileInfo.FileName;
    }
    return '';
}
