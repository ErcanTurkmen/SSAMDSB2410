import DocumentActionBinding from './DocumentActionBinding';
export default function DocumentStreamReadLink(pageProxy) {
    const actionBinding = DocumentActionBinding(pageProxy);
    const documentobject = actionBinding.Document_Nav || actionBinding.Document || actionBinding.PRTDocument;
    return documentobject['@odata.readLink'];
}
