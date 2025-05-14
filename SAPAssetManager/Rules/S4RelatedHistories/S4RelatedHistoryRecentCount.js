import commonlib from '../Common/Library/CommonLibrary';
import S4RelatedHistoryEntitySet from './S4RelatedHistoryEntitySet';

export default function S4RelatedHistoryRecentCount(context) {
    const entitySet = S4RelatedHistoryEntitySet(context);

    if (commonlib.isDefined(entitySet)) {
        return commonlib.getEntitySetCount(context, entitySet, '$filter=ReferenceType eq \'H\'');
    } else {
        return 0;
    }
}
