import {ValueIfExists} from '../Common/Library/Formatter';
import libDoc from './DocumentLibrary';

export default function DocumentFileName(context) {
    const doc = libDoc.getDocumentFromBinding(context.binding);
    return ValueIfExists(doc.FileName, '-', function(val) {
        return val.replace('&KEY&', '');
    });
}
