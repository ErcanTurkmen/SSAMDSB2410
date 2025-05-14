import GetRelatedWorkOrdersCount from '../RelatedWorkOrders/GetRelatedWorkOrdersCount';

export default function HasMoreThanTwoRelatedWorkOrders(context) {
    return GetRelatedWorkOrdersCount(context).then(count => count > 2);
}
