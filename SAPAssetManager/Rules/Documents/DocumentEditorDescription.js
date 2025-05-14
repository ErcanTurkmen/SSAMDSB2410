import libCom from '../Common/Library/CommonLibrary';
import DocumentLibrary from './DocumentLibrary';

export default function DocumentEditorDescription(context, encode = false) {
    const description = libCom.getStateVariable(context, 'DocumentEditorDescription') || DocumentLibrary.getDocumentFromBinding(context.binding).Description;
    return encode ? encodeURIComponent(description) : description;
}
