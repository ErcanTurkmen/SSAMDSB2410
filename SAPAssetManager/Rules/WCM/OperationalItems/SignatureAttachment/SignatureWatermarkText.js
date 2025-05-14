import WCMDocumentItemSequence from '../WCMDocumentItemSequence';

export default function SignatureWatermarkText(context) {
    return [
        `User: ${GetUserId(context)}`,
        `OperationalItem: ${GetOperationalItemUniqueId(context, context.binding)}`,
    ].join('\n');
}

function GetUserId(context) {
    return context.evaluateTargetPath('#Application/#ClientData/#Property:UserId');
}

function GetOperationalItemUniqueId(context, wcmDocumentItem) {
    return `${wcmDocumentItem.WCMDocument}_${WCMDocumentItemSequence(context, wcmDocumentItem)}`;
}
