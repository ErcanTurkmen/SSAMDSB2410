import DocumentLibrary from './DocumentLibrary';

export default function DocumentEditorReadLink(context) {
    return DocumentLibrary.getDocumentFromBinding(context.binding)['@odata.readLink'];
}
