import WCMDocumentItemSequence from '../WCMDocumentItemSequence';

export default function ItemNumber(context) {
    return WCMDocumentItemSequence(context, context.binding);
}
