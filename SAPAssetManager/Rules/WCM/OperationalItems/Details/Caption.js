import { ValueIfExists } from '../../../Common/Library/Formatter';
import { GetOperationalItemTechObjectId } from '../libWCMDocumentItem';

export default async function Caption(context) {
    const techNumber = ValueIfExists(await GetOperationalItemTechObjectId(context, context.binding), '-');
    return `${context.localizeText('operational_item')} ${techNumber}`;
}
