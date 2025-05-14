import TaggingSequence from '../Details/TaggingSequence';
import UntaggingSequence from '../Details/UntaggingSequence';
import { IsOperationalItemInUntagging } from '../libWCMDocumentItem';

export default function OperationalTaggingUntaggingSequence(context) {
    return IsOperationalItemInUntagging(context).then((isUntagging) => {
        const translationKey = isUntagging ? 'untag_sequence' : 'tag_sequence';
        const sequence = isUntagging ? UntaggingSequence(context) : TaggingSequence(context);
        return `${context.localizeText(translationKey)}: ${sequence}`; 
    });
}
