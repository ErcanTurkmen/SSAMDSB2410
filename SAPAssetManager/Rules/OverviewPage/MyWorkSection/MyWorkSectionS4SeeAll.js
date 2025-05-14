import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import ServiceOrdersDateView from '../../ServiceOrders/ListView/ServiceOrdersDateView';
import ServiceItemsDateView from '../../ServiceOrders/ListView/ServiceItemsDateView';

export default function MyWorkSectionS4SeeAll(context) {
    return IsServiceOrderLevel(context) ? ServiceOrdersDateView(context) : ServiceItemsDateView(context);
}
