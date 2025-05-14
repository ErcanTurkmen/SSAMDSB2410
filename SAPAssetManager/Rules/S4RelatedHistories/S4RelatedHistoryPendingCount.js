import commonlib from '../Common/Library/CommonLibrary';
import S4RelatedHistoryEntitySet from './S4RelatedHistoryEntitySet';

export default function S4RelatedHistoryPendingCount(context) {
    const entitySet = S4RelatedHistoryEntitySet(context);

    if (commonlib.isDefined(entitySet)) {
        return commonlib.getEntitySetCount(context, entitySet, '$filter=ReferenceType eq \'P\'');
    } else {
        return 0;
    }
}
