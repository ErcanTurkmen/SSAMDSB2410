
import libVal from '../Common/Library/ValidationLibrary';

export default function DocumentEditorIsImageFormat(fileName) {
    if (!libVal.evalIsEmpty(fileName)) {
        const supportedExtensions = new Set(['png', 'jpg', 'jpeg']);
        const extension = fileName.split('.').pop().toLowerCase();
        return supportedExtensions.has(extension);
    }
    return false;
}
