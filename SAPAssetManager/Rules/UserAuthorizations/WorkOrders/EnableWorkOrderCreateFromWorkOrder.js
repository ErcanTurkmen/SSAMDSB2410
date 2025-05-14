import EnableWorkOrderCreate from './EnableWorkOrderCreate';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function EnableWorkOrderCreateFromWorkOrder(context) {
    return libWO.isWorkOrderInCreatedState(context) ? Promise.resolve(false) : Promise.resolve(EnableWorkOrderCreate(context));
}
