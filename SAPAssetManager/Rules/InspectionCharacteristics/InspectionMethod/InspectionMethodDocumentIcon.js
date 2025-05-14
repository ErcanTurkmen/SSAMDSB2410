/**
* Returns the attachment icon if the Inspection Method contains a document
* @param {IClientAPI} context
*/

import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';

export default function InspectionMethodDocumentIcon(context) {
    const docIcon = AttachedDocumentIcon(context, context.binding.MethodDoc_Nav, undefined, 'Document_Nav');
    return docIcon && [docIcon];
}
