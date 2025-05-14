
import libVal from '../Common/Library/ValidationLibrary';

export default function DocumentEditorIsPdfFormat(fileName) {
    if (!libVal.evalIsEmpty(fileName)) {
        const extension = fileName.split('.').pop().toLowerCase();
        return extension === 'pdf';
    }
    return false;
}
