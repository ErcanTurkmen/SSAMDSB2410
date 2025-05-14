import commonLib from '../../Common/Library/CommonLibrary';

export default function DocumentFieldsAddRequired(context, requiredFields) {
    const attachments = context.evaluateTargetPathForAPI('#Control:Attachment').getValue();
    const attachmentDesc = commonLib.getControlValue(commonLib.getControlProxy(context, 'AttachmentDescription'));
    if (commonLib.isDefined(attachmentDesc)) {
        requiredFields.push('Attachment');
    }
    if (attachments.length) {
        if (!commonLib.isDefined(attachments[attachments.length -1].readLink)) {
            requiredFields.push('AttachmentDescription');
        }
    }
}
