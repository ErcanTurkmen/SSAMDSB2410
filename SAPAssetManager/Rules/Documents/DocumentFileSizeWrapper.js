import DocumentFileSize from './DocumentFileSize';
import libDoc from './DocumentLibrary';

export default function DocumentFileSizeWrapper(sectionProxy) {
    const doc = libDoc.getDocumentFromBinding(sectionProxy.binding);
    return DocumentFileSize(sectionProxy, doc);
}
