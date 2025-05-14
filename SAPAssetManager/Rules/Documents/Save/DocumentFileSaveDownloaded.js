import writeDocument from '../Save/DocumentSave';
import DocumentActionBinding from '../DocumentActionBinding';

export default function DocumentFileSaveDownloaded(pageProxy) {
    const actionBinding = DocumentActionBinding(pageProxy);
    const documentobject = actionBinding.Document_Nav || actionBinding.Document || actionBinding.PRTDocument;
    writeDocument(pageProxy, documentobject);
}
