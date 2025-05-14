import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import ServiceItemsDateFilter from '../../ServiceOrders/Count/ServiceItemsDateFilter';
import ServiceOrdersDateFilter from '../../ServiceOrders/Count/ServiceOrdersDateFilter';

export default function MyWorkSectionS4FooterLabel(context) {
    return IsServiceOrderLevel(context) ? ServiceOrdersDateFilter(context) : ServiceItemsDateFilter(context);
}
