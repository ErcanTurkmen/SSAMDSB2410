import WorkPermitSystemStatusTextOrEmpty from './WorkPermitSystemStatusTextOrEmpty';
import WorkPermitUsageDescriptionOrEmpty from './WorkPermitUsageDescriptionOrEmpty';

export default function WorkPermitDetailsTags(context) {
    return Promise.all([
        WorkPermitSystemStatusTextOrEmpty(context),
        WorkPermitUsageDescriptionOrEmpty(context),
    ]).then(possibleEmptyTags => possibleEmptyTags.filter(stringOrEmpty => !!stringOrEmpty));
}
