import DocumentLibrary from './DocumentLibrary';

export default function DocumentEditorMimeType(context) {
    return DocumentLibrary.getDocumentFromBinding(context.binding).MimeType;
}
