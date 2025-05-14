import DocumentActionBinding from './DocumentActionBinding';
export default function DocumentStreamName(clientAPI) {
    const actionBinding = DocumentActionBinding(clientAPI);
    const documentobject = actionBinding.Document_Nav || actionBinding.Document || actionBinding.PRTDocument;
    return documentobject['@odata.id'].replace(/[()=',]/g, '');
}
