import WCMDocumentItemSequence from './WCMDocumentItemSequence';
import { GetOperationalItemTechObjectId } from './libWCMDocumentItem';

export default async function OperationaItemSequenceDescriptionObjectId(context) {
    const wcmDocumentItem = context.binding;
    return `${WCMDocumentItemSequence(context, wcmDocumentItem)} - ${wcmDocumentItem.ShortText || '-'} (${await GetOperationalItemTechObjectId(context, wcmDocumentItem)})`;
}
