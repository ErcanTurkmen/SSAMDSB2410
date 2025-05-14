import AttachedDocumentIcon from '../../../Documents/AttachedDocumentIcon';
import DocumentsBDSCount from '../../../Documents/Count/DocumentsBDSCount';

export default function WorkApprovalsIcons(context) {
    return DocumentsBDSCount(context, context.binding).then(docsCount => {
        const attachmentIcon = AttachedDocumentIcon(context, undefined, docsCount);
        return attachmentIcon ? [attachmentIcon] : [];
    });
}
