import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function S4RelatedHistoryPriority(context) {
    return CommonLibrary.getEntityProperty(context, `ServicePriorities('${context.binding.Priority}')`, 'Description')
        .catch(err => {
            Logger.debug('S4 HISTORY', err);
            return 'No Priority';
        });
}
