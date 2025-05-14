import GetRelatedWorkOrdersCount from '../../RelatedWorkOrders/GetRelatedWorkOrdersCount';
import WorkPermitsCount from '../../WorkPermits/WorkPermitsCount';

export default function GetRelatedObjectsCount(context) {
    switch (context.getName()) {
        case 'WorkPermitsListSection':
            return WorkPermitsCount(context);
        case 'WCMRelatedWorkOrdersTable':
            return GetRelatedWorkOrdersCount(context);
        default:
            return Promise.resolve(0);        
    }
}
