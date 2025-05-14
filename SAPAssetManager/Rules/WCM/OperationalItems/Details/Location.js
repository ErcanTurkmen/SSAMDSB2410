import { GetOperationalItemTechObjectId } from '../libWCMDocumentItem';

export default function Location(context) {
    return GetOperationalItemTechObjectId(context, context.binding);
}
