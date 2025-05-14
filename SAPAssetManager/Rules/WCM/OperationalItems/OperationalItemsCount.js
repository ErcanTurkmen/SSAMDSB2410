import libCom from '../../Common/Library/CommonLibrary';
import OperationalItemsListViewEntitySet from './ListView/OperationalItemsListViewEntitySet';

export default function OperationalItemsCount(context, queryOptions = '') {
    return libCom.getEntitySetCount(context, OperationalItemsListViewEntitySet(context.getPageProxy()), queryOptions).then(count => {
        return count;
    });
}
