import IsAndroid from '../Common/IsAndroid';
import libVal from '../Common/Library/ValidationLibrary';
import DocumentsIsVisible from './DocumentsIsVisible';


export default function AttachedDocumentIcon(context, docs, docsCount, docProp = 'Document') {
    const docIcon = IsAndroid(context) ? '/SAPAssetManager/Images/attachmentStepIcon.android.png' : '/SAPAssetManager/Images/attachmentStepIcon.png';
    const isDocumentsEnabled = DocumentsIsVisible(context);

    if (isDocumentsEnabled) {
        if (!libVal.evalIsEmpty(docs)) {
            if (docs.some(doc => doc[docProp] && !libVal.evalIsEmpty(doc[docProp].FileName))) {
                return docIcon;
            }
        } else if (docsCount > 0) {
            return docIcon;
        }
    }

    return undefined;
}
